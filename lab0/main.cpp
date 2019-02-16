#include <stdio.h>
#include <stdlib.h>
#include "offreader.h"
#include "jmesh.h"

int
main(void)
{
    jmesh * mesh;

    FILE * fp = fopen("beethoven.off", "r");
    mesh = new_jmesh(fp);
    fclose(fp);

    if (mesh == NULL)
        fprintf(stderr,"load_off_mesh failed\n");

    /*
    for(int i=0; i < 72; i++) {
        for(int j = 0; j < 3; j++) {
            printf("%f ", mesh->vertices[i * 3 + j]);
        }
        printf("\n");
    }
     */

    printf("nvert: %d ntri: %d", mesh->nvert, mesh->ntri);
    free_mesh(mesh);

    return 0;
}



//
// Created by Derek Sun on 2019/2/14.
//

