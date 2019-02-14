#include<stdio.h>
#include<stdbool.h>
#include<string.h>
#include<stdlib.h>
#include"offreader.h"
#include"jmesh.h"


int * add_element(const int * v, int num, int * trig, int * size, int cur) {
    if(cur == *size -1) {
        int * p_temp = NULL;
        *size *= 2;
        p_temp = (int *)realloc(trig, *size * 3 * sizeof(int));
        if(p_temp == NULL) {
            printf("Failed to resize triangle array!");
            exit(1);
        }
        trig = p_temp;
    }
    int i;
    for(i = 1; i <= num; i++) {
        trig[(cur + i) * 3 + 0] = v[(i-1) * 3 + 0];
        trig[(cur + i) * 3 + 1] = v[(i-1) * 3 + 1];
        trig[(cur + i) * 3 + 2] = v[(i-1) * 3 + 2];
    }
    cur = cur + num;

    return trig;
}


int load_off_mesh(FILE * fp, jmesh * jm) {

    //printf("In load_mesh successfully!");

    FILE * file = fp;
    const int MAX_SIZE = 100;
    char line[MAX_SIZE];

    if(file == NULL) {
        printf("Failed to read file!");
        exit(1);
    }

    int lineCount = 0; //total number of line
    int vertexCount; //total number of vertex
    int faceCount; //.... face
    int edgeCount; //.... edge
    int paramCount = 0; //params in a line

    int triArrSize = faceCount;

    int triCount = 0;
    int triTotalCount = 0;
    int vtxCount = 0;

    float * vtx;
    float * norm;
    int * tri;
    bool flag = false;
    bool flag2 = false;

    while(!feof(file)) {
        //read 1st line, if it's off file
        if(lineCount == 0) {
            char tp[3];
            fgets(line, MAX_SIZE, file);
            sscanf(line, "%s", tp);
            if(strcmp(tp, "OFF") != 0) {
                printf("Not a OFF file!");
                exit(1);
            }
            lineCount++;
            continue;
        }
        //if it's comment
        /* start with //
        if(strcmp(line[0], "#") == 0) {
            continue;
        }
        */
        //if start with /* and end with */
        //read stats
        if(lineCount == 1) {
            fgets(line, MAX_SIZE, file);
            int ret = sscanf(line, "%d %d %d", &vertexCount, &faceCount, &edgeCount);
            if(ret != 3) {
                continue;
            }
            /*
            char delim[] = " ";
            char* ptr = strtok(line, delim);
            while(ptr != NULL && paramCount < 3) {
                if(paramCount == 0) {
                    sscanf(ptr, "%d", vertexCount);
                    paramCount++;
                }
                if(paramCount == 1) {
                    sscanf(ptr, "%d", faceCount);
                    paramCount++;
                }
                if(paramCount == 2) {
                    sscanf(ptr, "%d", edgeCount);
                    paramCount++;
                }
                ptr = strtok(NULL, delim);
            }
            */
            lineCount++;
            continue;
        }
        //if reading stats fails
        if(vertexCount == -1 || faceCount == -1) {
            printf("Failed to read the number of vertex and faces!");
            exit(1);
        }
        //printf("Got stats successfully!");
        //allocate memory for arr(initial)
        if(!flag) {
            jm->nvert = vertexCount;
            triArrSize = faceCount;
            vtx = (float*)malloc(sizeof(float) * 3 * vertexCount);
            tri = (int*)malloc(sizeof(int) * 3 * triArrSize);
            norm = (float*)malloc(sizeof(float) * 3 * faceCount);
            jm->vertices = vtx;
            jm->triangles = tri;
            jm->normals = norm;
            flag = true;
        }
        //printf("Allocated successfully!");

        //read vertex
        if(lineCount >= 2 && lineCount < 2 + vertexCount) {
            fgets(line, MAX_SIZE, file);
            int ret = sscanf(line, "%f %f %f", &vtx[vtxCount * 3 + 0], &vtx[vtxCount * 3 + 1], &vtx[vtxCount * 3 + 2]);
            if(ret != 3) {
                printf("Read Error!)");
                exit(1);
            }
            lineCount++;
            vtxCount++;
            if(lineCount == 2 + vertexCount) continue;
        }
            //read faces
        else if(lineCount >= 2 + vertexCount && lineCount < 2 + vertexCount + faceCount) {
            fgets(line, MAX_SIZE, file);
            int eNum;
            int v[3];
            float r, g, b, t;
            int ret = sscanf(line, "%d %d %d %d %f %f %f %f", &eNum, &v[0], &v[1], &v[2], &r, &g, &b, &t);
            if(eNum == 3) {
                if(ret >= eNum + 1) {
                    tri = add_element(v, eNum-2, tri, &triArrSize, triTotalCount);
                    triCount++;
                    triTotalCount++;
                }
                else {
                    printf("Read Error! Less than 4 var filled.");
                    exit(1);
                }
            }
            else if(eNum > 3){
                int * vv = (int*)malloc(sizeof(int) * (eNum+1));
                char delim[] = " ";
                char* ptr = strtok(line, delim);
                int ic;
                for(ic = 0; ic < eNum; ic++) {
                    sscanf(ptr, "%d", &vv[ic]);
                    ptr = strtok(NULL, delim);
                }
                //eNum = eNum_2;
                int length = (eNum - 2) * 3;
                int vtxReformed[length];
                //int gp = 0;
                int i;
                for(i = 0; i < length; i++) {
                    if(i % 3 == 0) {
                        vtxReformed[i] = vv[0];
                    }
                    else if(i % 3 == 1) {
                        vtxReformed[i] = vv[(i/3) + 1];
                    }
                    else if(i % 3 == 2) {
                        vtxReformed[i] = vv[(i/3) + 2];
                    }
                }
                tri = add_element(vtxReformed, eNum-2, tri, &triArrSize, triTotalCount);
                triTotalCount += (eNum - 2);
            }
            else {
                printf("Failed to read eNum");
                exit(1);
            }
            jm->triangles = tri;
            lineCount++;
        }
            //if edge, read edges
        else if(lineCount >= 2 + vertexCount + faceCount && edgeCount != -1) {
            //printf("Lines for edges exist.");
            if(!flag2) {
                jm->ntri = triTotalCount;
                flag2 = true;
            }
            fgets(line, MAX_SIZE, file);
            lineCount++;
        }
        else {
            fgets(line, MAX_SIZE, file);
        }

    }

    return vertexCount;
}//
// Created by Derek Sun on 2019/2/14.
//

