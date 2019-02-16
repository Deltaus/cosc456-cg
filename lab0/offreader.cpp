#include<stdio.h>
#include<stdbool.h>
#include<string.h>
#include<stdlib.h>
#include <cmath>
#include"offreader.h"
#include"jmesh.h"


typedef struct {
    int * tri_p;
    float * norm_p;
} ptrn;

ptrn add_element(const int * v, int num, int * trig, int * size, int cur, float * normal, const float * vertex) {
    if(cur == *size -1) {
        int * p_temp = NULL;
        float * p_temp_n = NULL;
        *size *= 2;
        p_temp = (int *)realloc(trig, *size * 3 * sizeof(int));
        p_temp_n = (float *)realloc(normal, *size * 3 * sizeof(float));
        if(p_temp == NULL || p_temp_n == NULL) {
            printf("Failed to resize triangle array!");
            exit(1);
        }
        trig = p_temp;
        normal = p_temp_n;
    }
    int i;
    for(i = 0; i < num; i++) {
        trig[(cur + i) * 3 + 0] = v[(i) * 3 + 0]; //v0
        trig[(cur + i) * 3 + 1] = v[(i) * 3 + 1]; //v1
        trig[(cur + i) * 3 + 2] = v[(i) * 3 + 2]; //v2

        float v1_x = vertex[v[(i) * 3 + 1] * 3 + 0];
        float v1_y = vertex[v[(i) * 3 + 1] * 3 + 1];
        float v1_z = vertex[v[(i) * 3 + 1] * 3 + 2];
        float v2_x = vertex[v[(i) * 3 + 2] * 3 + 0];
        float v2_y = vertex[v[(i) * 3 + 2] * 3 + 1];
        float v2_z = vertex[v[(i) * 3 + 2] * 3 + 2];
        float v0_x = vertex[v[(i) * 3 + 0] * 3 + 0];
        float v0_y = vertex[v[(i) * 3 + 0] * 3 + 1];
        float v0_z = vertex[v[(i) * 3 + 0] * 3 + 2];

        float u1 = v1_x - v0_x;
        float u2 = v1_y - v0_y;
        float u3 = v1_z - v0_z;
        float v1 = v2_x - v0_x;
        float v2 = v2_y - v0_y;
        float v3 = v2_z - v0_z;

        float x = u2 * v3 - u3 * v2;
        float y = u3 * v1 - u1 * v3;
        float z = u1 * v2 - u2 * v1;

        normal[(cur + i) * 3 + 0] = x / sqrt(x * x + y * y + z * z);
        normal[(cur + i) * 3 + 1] = y / sqrt(x * x + y * y + z * z);
        normal[(cur + i) * 3 + 2] = z / sqrt(x * x + y * y + z * z);
    }
    cur = cur + num;

    ptrn pts;
    pts.norm_p = normal;
    pts.tri_p = trig;

    return pts;
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

    ptrn tempPt;

    float min_x, max_x, min_y, max_y, min_z, max_z;
    double sum_x = 0;
    double sum_y = 0;
    double sum_z = 0;
    float avg_x, avg_y, avg_z;

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
            if(lineCount == 2) {
                min_x = max_x = vtx[0];
                min_y = max_y = vtx[1];
                min_z = max_z = vtx[2];
                sum_x += vtx[0];
                sum_y += vtx[1];
                sum_z += vtx[2];
            }
            else {
                if(vtx[vtxCount * 3 + 0] > max_x) max_x = vtx[vtxCount * 3 + 0];
                if(vtx[vtxCount * 3 + 0] < min_x) min_x = vtx[vtxCount * 3 + 0];
                if(vtx[vtxCount * 3 + 1] > max_y) max_y = vtx[vtxCount * 3 + 1];
                if(vtx[vtxCount * 3 + 1] < min_y) min_y = vtx[vtxCount * 3 + 1];
                if(vtx[vtxCount * 3 + 2] > max_z) max_z = vtx[vtxCount * 3 + 2];
                if(vtx[vtxCount * 3 + 2] < min_z) min_z = vtx[vtxCount * 3 + 2];
                sum_x += vtx[vtxCount * 3 + 0];
                sum_y += vtx[vtxCount * 3 + 1];
                sum_z += vtx[vtxCount * 3 + 2];
            }
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
            //float r=0.0, g=0.0, b=0.0, t=0.0;
            int ret = sscanf(line, "%d%d%d%d", &eNum, &v[0], &v[1], &v[2]);
            if(eNum == 3) {
                if(ret >= eNum + 1) {
                    tempPt = add_element(v, eNum-2, tri, &triArrSize, triTotalCount, norm, vtx);
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
                tempPt = add_element(vtxReformed, eNum-2, tri, &triArrSize, triTotalCount, norm, vtx);
                triTotalCount += (eNum - 2);
            }
            else {
                printf("Failed to read eNum");
                exit(1);
            }
            jm->triangles = tempPt.tri_p;
            jm->normals = tempPt.norm_p;
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
    /*
    avg_x = sum_x / vertexCount;
    avg_y = sum_y / vertexCount;
    avg_z = sum_z / vertexCount;
    printf("Max_x: %f , Min_x: %f, Avg_x: %f \n", max_x, min_x, avg_x);
    printf("Max_y: %f , Min_y: %f, Avg_y: %f \n", max_y, min_y, avg_y);
    printf("Max_z: %f , Min_z: %f, Avg_z: %f \n", max_z, min_z, avg_z);
     */
    return vertexCount;
}//
// Created by Derek Sun on 2019/2/14.
//

