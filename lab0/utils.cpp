//
// Created by Derek Sun on 2019/2/14.
//

#include <stdlib.h>
#include <stdio.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <GLUT/glut.h>
#include "utils.h"
#define OUTPUT_MODE 1

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

    glClearColor(1.0, 0.5, 0.0, 1.0);
    glClear(GL_COLOR_BUFFER_BIT);
    glutWireCube(current_gs->cubesize);
    glutSwapBuffers();

    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
    static GLfloat vtx[8][3] =
            {
                    {0.0f,0.0f,0.0f},//0
                    {0.0f,0.0f,0.5f},//1
                    {0.0f,0.5f,0.0f},//2
                    {0.0f, 0.5f, 0.5f},//3
                    {0.5f, 0.0f, 0.0f},//4
                    {0.5f,0.0f,0.5f},//5
                    {0.5f,0.5f,0.0f},//6
                    {0.5f, 0.5f, 0.5f}//7
            };
    GLfloat color[4][3] = 
            {
                    {0.0f,0.0f,0.5f},
                    {0.5f,0.0f,0.0f},
                    {1.0f,1.0f,0.0f},
                    {1.0f,0.0f,1.0f}
            };
    glRotatef(5.0f,10.0f,5.0f,15.0f);

    glFrontFace(GL_CCW);
    glPolygonMode(GL_FRONT, GL_FILL);
    glPolygonMode(GL_BACK, GL_FILL);

    glBegin(GL_POLYGON);
    glColor3fv(color[0]);
    glVertex3fv(vtx[1]);
    glColor3fv(color[1]);
    glVertex3fv(vtx[3]);
    glColor3fv(color[2]);
    glVertex3fv(vtx[7]);
    glColor3fv(color[3]);
    glVertex3fv(vtx[5]);
    glEnd();

    glBegin(GL_QUADS);
    glColor3fv(color[0]);
    glVertex3fv(vtx[5]);
    glColor3fv(color[1]);
    glVertex3fv(vtx[7]);
    glColor3fv(color[2]);
    glVertex3fv(vtx[4]);
    glColor3fv(color[0]);
    glVertex3fv(vtx[6]);

    glColor3fv(color[0]);
    glVertex3fv(vtx[7]);
    glColor3fv(color[1]);
    glVertex3fv(vtx[3]);
    glColor3fv(color[2]);
    glVertex3fv(vtx[2]);
    glColor3fv(color[0]);
    glVertex3fv(vtx[6]);

    glColor3fv(color[0]);
    glVertex3fv(vtx[3]);
    glColor3fv(color[1]);
    glVertex3fv(vtx[1]);
    glColor3fv(color[2]);
    glVertex3fv(vtx[0]);
    glColor3fv(color[0]);
    glVertex3fv(vtx[2]);

    glColor3fv(color[0]);
    glVertex3fv(vtx[1]);
    glColor3fv(color[1]);
    glVertex3fv(vtx[5]);
    glColor3fv(color[2]);
    glVertex3fv(vtx[4]);
    glColor3fv(color[0]);
    glVertex3fv(vtx[0]);

    glBegin(GL_POLYGON);
    glColor3fv(color[3]);
    glVertex3fv(vtx[0]);
    glColor3fv(color[4]);
    glVertex3fv(vtx[2]);
    glColor3fv(color[5]);
    glVertex3fv(vtx[6]);
    glColor3fv(color[0]);
    glVertex3fv(vtx[4]);
    glEnd();

    glPopMatrix();
    glFlush();

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

    switch(c) {
        case 'q':
        case 'Q':
            exit(EXIT_SUCCESS);
            break;
        case 's':
        case 'S':
            //
            break;
    }
}
