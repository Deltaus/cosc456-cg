//
// Created by Derek Sun on 2019/2/14.
//
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <cmath>
#include <GLUT/glut.h>
#include "utils.h"
#include "offreader.h"
#include "jmesh.h"

GLfloat vtx[72][3];

int main(int argc, char **argv)
{
    graphics_state gs;

    gs.height=1024;
    gs.width =1024;

    /* check for command line arguments */
    if(argc != 2){
        printf("Usage: executable cubesize\n");
        exit(1);
    }

    jmesh * vert = readOffFile("planets.off");
    for(int i = 0; i < vert->nvert; i++) {
        vtx[i][0] = vert->vertices[i * 3 + 0];
        vtx[i][1] = vert->vertices[i * 3 + 1];
        vtx[i][2] = vert->vertices[i * 3 + 2];
    }
    free_mesh(vert);

    gs.cubesize = strtod(argv[1], NULL);
    print_howto();

    { /* GLUT initialization */
        glutInit(&argc,argv);
        glutInitDisplayMode(GLUT_RGB);
        glutInitWindowSize(gs.width,gs.height);
        glutInitWindowPosition(200,200);
        glutCreateWindow(argv[0]);

        glutDisplayFunc(display);
        glutIdleFunc(display);
        glutReshapeFunc(reshape);

        glutKeyboardFunc(keys);
        glutMouseFunc(mouse_handler);
        glutMotionFunc(trackMotion);
    }

    init(&gs);

    glutMainLoop();

    return 0;
}