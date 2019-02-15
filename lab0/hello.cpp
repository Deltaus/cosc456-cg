//
// Created by Derek Sun on 2019/2/14.
//
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <GLUT/glut.h>
#include "utils.h"

int
main(int argc, char **argv)
{
    graphics_state gs;

    gs.height=512;
    gs.width =512;

    /* check for command line arguments */
    if(argc != 2){
        printf("Usage: executable cubesize\n");
        exit(1);
    }

    gs.cubesize = strtod(argv[1], NULL);
    print_howto();

    { /* GLUT initialization */
        glutInit(&argc,argv);
        glutInitDisplayMode(GLUT_RGB);
        glutInitWindowSize(gs.width,gs.height);
        glutInitWindowPosition(100,100);
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

