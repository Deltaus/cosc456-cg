//
// Created by Derek Sun on 2019/2/14.
//

#ifndef UNTITLED1_OFFREADER_H
#define UNTITLED1_OFFREADER_H

#include<stdio.h>
#include "jmesh.h"
/* return value: number of vertices upon success, -1 upon failure*/
int load_off_mesh(FILE *, jmesh *);

#endif //UNTITLED1_OFFREADER_H
