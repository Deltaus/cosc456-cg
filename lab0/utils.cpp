//
// Created by Derek Sun on 2019/2/14.
//

#include <stdlib.h>
#include <stdio.h>
#include <OpenGL/gl.h>
#include <OpenGL/glu.h>
#include <GLUT/glut.h>
#include "utils.h"
#include "offreader.h"
#include "jmesh.h"

//extern jmesh * vert;

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

void set_gs(graphics_state * gs){
    current_gs = gs;
}

void init(graphics_state * gs){
    current_gs = gs;
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
}

jmesh * readOffFile(const char * filename) {

    static jmesh * mesh;

    FILE * fp = fopen(filename, "r");
    mesh = new_jmesh(fp);
    fclose(fp);

    if (mesh == NULL) {
        fprintf(stderr,"load_off_mesh failed\n");
        exit(1);
    }

    printf("nvert: %d ntri: %d", mesh->nvert, mesh->ntri);

    return mesh;
}

void printMesh(const jmesh * mesh) {

    for(int i=0; i < 72; i++) {
        for(int j = 0; j < 3; j++) {
            printf("%f ", mesh->vertices[i * 3 + j]);
        }
        printf("\n");
    }
}

void drawCube(int index, GLfloat vtx[][3],GLfloat color[][3], GLfloat dist[]) {
    glPushMatrix();
    //glBegin(GL_QUADS);
    /*
        glColor3fv(color[0]);
         glVertex3f(vtx[ 1]);
        glColor3fv(color[1]);
         glVertex3f(vtx[ 3]);
        glColor3fv(color[2]);
         glVertex3f(vtx[ 7]);
        glColor3fv(color[3]);
         glVertex3f(vtx[ 5]);
    //glEnd();

    //glBegin(GL_QUADS);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 5]);
        glColor3fv(color[1]);
         glVertex3f(vtx[ 7]);
        glColor3fv(color[2]);
         glVertex3f(vtx[ 6]);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 4]);

        glColor3fv(color[0]);
         glVertex3f(vtx[ 7]);
        glColor3fv(color[1]);
         glVertex3f(vtx[ 3]);
        glColor3fv(color[2]);
         glVertex3f(vtx[ 2]);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 6]);

        glColor3fv(color[0]);
         glVertex3f(vtx[ 3]);
        glColor3fv(color[1]);
         glVertex3f(vtx[ 1]);
        glColor3fv(color[2]);
         glVertex3f(vtx[ 0]);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 2]);

        glColor3fv(color[0]);
         glVertex3f(vtx[ 1]);
        glColor3fv(color[1]);
         glVertex3f(vtx[ 5]);
        glColor3fv(color[2]);
         glVertex3f(vtx[ 4]);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 0]);

        //glBegin(GL_QUADS);
        glColor3fv(color[3]);
         glVertex3f(vtx[ 0]);
        glColor3fv(color[4]);
         glVertex3f(vtx[ 2]);
        glColor3fv(color[5]);
         glVertex3f(vtx[ 6]);
        glColor3fv(color[0]);
         glVertex3f(vtx[ 4]);
    */
    glRotatef(20,0.0,0.0,1.0);
    glScalef(10, 10, 10);
    //glEnd();
    glPopMatrix();
    //glTranslatef(dist[index], 0, 0);
}

void drawCube2(int speed, float dist, int index) {

    //printf("DRAWING");

    glPushMatrix();
        glColor4f(0.0,0.82,1.0,0.5);
        glRotatef(speed,0.0,0.0,-1.0);
        glTranslatef(dist,0.0,0.0);

        glBegin(GL_QUADS);
            glVertex3f(vtx[index*8+1][0],vtx[index*8+1][1],vtx[index*8+1][2]);
            glVertex3f(vtx[index*8+3][0],vtx[index*8+3][1],vtx[index*8+3][2]);
            glVertex3f(vtx[index*8+7][0],vtx[index*8+7][1],vtx[index*8+7][2]);
            glVertex3f(vtx[index*8+5][0],vtx[index*8+5][1],vtx[index*8+5][2]);

            glVertex3f(vtx[index*8+5][0],vtx[index*8+5][1],vtx[index*8+5][2]);
            glVertex3f(vtx[index*8+7][0],vtx[index*8+7][1],vtx[index*8+7][2]);
            glVertex3f(vtx[index*8+6][0],vtx[index*8+6][1],vtx[index*8+6][2]);
            glVertex3f(vtx[index*8+4][0],vtx[index*8+4][1],vtx[index*8+4][2]);

            glVertex3f(vtx[index*8+7][0],vtx[index*8+7][1],vtx[index*8+7][2]);
            glVertex3f(vtx[index*8+3][0],vtx[index*8+3][1],vtx[index*8+3][2]);
            glVertex3f(vtx[index*8+2][0],vtx[index*8+2][1],vtx[index*8+2][2]);
            glVertex3f(vtx[index*8+6][0],vtx[index*8+6][1],vtx[index*8+6][2]);

            glVertex3f(vtx[index*8+3][0],vtx[index*8+3][1],vtx[index*8+3][2]);
            glVertex3f(vtx[index*8+1][0],vtx[index*8+1][1],vtx[index*8+1][2]);
            glVertex3f(vtx[index*8+0][0],vtx[index*8+0][1],vtx[index*8+0][2]);
            glVertex3f(vtx[index*8+2][0],vtx[index*8+2][1],vtx[index*8+2][2]);

            glVertex3f(vtx[index*8+1][0],vtx[index*8+1][1],vtx[index*8+1][2]);
            glVertex3f(vtx[index*8+5][0],vtx[index*8+5][1],vtx[index*8+5][2]);
            glVertex3f(vtx[index*8+4][0],vtx[index*8+4][1],vtx[index*8+4][2]);
            glVertex3f(vtx[index*8+0][0],vtx[index*8+0][1],vtx[index*8+0][2]);

            glVertex3f(vtx[index*8+0][0],vtx[index*8+0][1],vtx[index*8+0][2]);
            glVertex3f(vtx[index*8+2][0],vtx[index*8+2][1],vtx[index*8+2][2]);
            glVertex3f(vtx[index*8+6][0],vtx[index*8+6][1],vtx[index*8+6][2]);
            glVertex3f(vtx[index*8+4][0],vtx[index*8+4][1],vtx[index*8+4][2]);
        glEnd();

    glPopMatrix();

}

void display(void){

    glClearColor(1.0, 0.5, 0.0, 1.0);
    glClear(GL_COLOR_BUFFER_BIT);
    glutWireCube(current_gs->cubesize);

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(62.0,1.0,1,10);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    gluLookAt(0,-20,20,0,0,0,0,0,1);
    
    drawCube2(5, 0, 0); //sun
    drawCube2(30,4, 1); //mer
    drawCube2(25,6.5, 2); //ven
    drawCube2(20, 9, 3); //earth
    drawCube2(15, 10, 4); //mar
    drawCube2(10, 12, 5); //jep
    drawCube2(5, 13, 6); //sat
    drawCube2(3, 14, 7); //ura
    drawCube2(1, 15, 8); //nep

    glutSwapBuffers();
    glFlush();

    /*-
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
                    {0.5f,0.5f,0.5f},
                    {0.9f,0.9f,0.2f},
                    {1.0f,1.0f,0.0f},
                    {1.0f,0.0f,1.0f}
            };
    glRotatef(5.0f,10.0f,5.0f,15.0f);
    -*/

    //GLfloat distance[9] = {9, 1, 2, 3, 4, 5, 6, 7, 8};
    /*
    drawCube(0, vtx, color, distance);
    drawCube(1, vtx, color, distance);
    drawCube(2, vtx, color, distance);
    drawCube(3, vtx, color, distance);
    drawCube(4, vtx, color, distance);
    drawCube(5, vtx, color, distance);
    drawCube(6, vtx, color, distance);
    drawCube(7, vtx, color, distance);
    drawCube(8, vtx, color, distance);
    */

}

void
reshape(int w, int h){

    //glViewport (0, 0, (GLsizei) w, (GLsizei) h);

    //glMatrixMode (GL_PROJECTION);
    //glLoadIdentity ();

    //gluPerspective(60.0, (GLfloat) w/(GLfloat) h, 1.0, 20.0);
    //glMatrixMode(GL_MODELVIEW);
    //glLoadIdentity();
    //gluLookAt (0.9, -0.9, 0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0);
    //glFlush();

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




