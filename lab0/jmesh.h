//
// Created by Derek Sun on 2019/2/14.
//

#ifndef UNTITLED1_JMESH_H
#define UNTITLED1_JMESH_H

#include<stdio.h>
typedef struct {
    int nvert;
    int ntri;
    float * vertices;
    float * normals;
    int * triangles;
} jmesh;


/* return value: pointer to jmesh upon success, NULL upon failure*/
jmesh * new_jmesh(FILE *);
void free_mesh(jmesh *);

#endif //UNTITLED1_JMESH_H
