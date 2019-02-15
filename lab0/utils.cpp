//
// Created by Derek Sun on 2019/2/14.
//

#include <stdlib.h>
#include <stdio.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <GLUT/glut.h>
#include "utils.h"

static graphics_state * current_gs;

void print_howto(void){
    printf("So far it does nothing - you output howto here\n");
    printf("Up Arrow:     Rotate Up\n");
    printf("Down Arrow:   Rotate Down\n");
    printf("Left Arrow:   Rotate Left\n");
    printf("Right Arrow:  Rotate Right\n");
    printf("Page UP:      Zoom In\n");
    printf("Page Down:    Zoom Out\n");
    printf("Home:         Reset View\n");
    printf("Insert:       Exit Program\n");
}

void
set_gs(graphics_state * gs){
    current_gs = gs;
}

void
init(graphics_state * gs){
    current_gs = gs;
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
}

void
display(void){
    glClear(GL_COLOR_BUFFER_BIT);
    glutWireCube(current_gs->cubesize);
    glutSwapBuffers();
}

void
reshape(int w, int h){

}

void
mouse_handler(int button, int button_state, int x, int y){

}

void
trackMotion(int x, int y) {

}

void
keys(unsigned char c, int x, int y) {

    if(c == 'Q' || c == 'q') {
        exit(EXIT_SUCCESS);
    }
}
