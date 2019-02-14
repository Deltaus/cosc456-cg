#include <stdio.h>
#include <stdlib.h>
#include "offreader.h"
#include "jmesh.h"

int
main(void)
{
    //printf("XXXXXX!");

    jmesh * mesh;

    //printf("START");

    FILE * fp = fopen("bunny.off", "r");
    mesh = new_jmesh(fp);
    fclose(fp);

    if (mesh == NULL)
        fprintf(stderr,"load_off_mesh failed\n");

    //printf("Got mesh!");
    printf("nvert: %d ntri: %d", mesh->nvert, mesh->ntri);
    free_mesh(mesh);

    return 0;
}



//
// Created by Derek Sun on 2019/2/14.
//

