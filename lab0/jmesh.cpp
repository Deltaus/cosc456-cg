//
// Created by Derek Sun on 2019/2/14.
//

#include<stdio.h>
#include<stdlib.h>
#include "jmesh.h"
#include "offreader.h"


jmesh *
new_jmesh(FILE * fp)
{
   jmesh * jm;

   jm = (jmesh* )malloc(sizeof(jmesh));

   load_off_mesh(fp, jm);

   return jm;
}

void
free_mesh(jmesh * jm) {
	free(jm->vertices);
	free(jm->normals);
	free(jm->triangles);
}