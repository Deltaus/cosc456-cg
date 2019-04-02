#include <stdio.h>
#include <stdlib.h>
#include "offreader.h"
#include "jmesh.h"

int
main(void)
{
    jmesh * mesh;

    FILE * fp = fopen("mushroom.off", "r");
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
    /*
    FILE * wf = fopen("/Users/deltau/MyDocuments/graphics/beethoven.obj", "w+");
    int i;
    for(i = 0; i < mesh->nvert; i++) {
        fprintf(wf, "%s %f %f %f\n", "v", mesh->vertices[i*3], mesh->vertices[i*3+1], mesh->vertices[i*3+2]);
    }
    for(i = 0; i < mesh->ntri; i++) {
        fprintf(wf, "%s %d %d %d\n", "f", mesh->triangles[i*3], mesh->triangles[i*3+1], mesh->triangles[i*3+2]);
    }
     */
    printf("nvert: %d ntri: %d", mesh->nvert, mesh->ntri);
    free_mesh(mesh);

    return 0;
}



//
// Created by Derek Sun on 2019/2/14.
//

