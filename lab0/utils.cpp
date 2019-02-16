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

void drawCube2(int speed, float dist, int index) {

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

void drawTest() {

    glPushMatrix();
    glColor4f(0.0,0.82,1.0,0.5);
    glRotatef(10,0.0,0.0,-1.0);

    GLfloat color[8][3] =  //棱柱顶点颜色
            {
                    {0.0f,0.0f,1.0f},
                    {1.0f,0.0f,0.0f},
                    {1.0f,1.0f,0.0f},
                    {1.0f,0.0f,1.0f},
                    {1.0f,0.0f,0.0f},
                    {0.0f,1.0f,0.0f},
                    {0.0f,0.0f,1.0f},
                    {1.0f,1.0f,0.0f}
            };

    glBegin(GL_POLYGON);
     
    glVertex3fv(vtx[2]);
    
    glVertex3fv(vtx[4]);
      
    glVertex3fv(vtx[5]);
       
    glVertex3fv(vtx[3]);
        
    glVertex3fv(vtx[1]);
        
    glVertex3fv(vtx[0]);
    glEnd();

    glBegin(GL_QUADS);
     
    glVertex3fv(vtx[8]);
    
    glVertex3fv(vtx[10]);
      
    glVertex3fv(vtx[4]);
     
    glVertex3fv(vtx[2]);

     
    glVertex3fv(vtx[6]);
    
    glVertex3fv(vtx[8]);
      
    glVertex3fv(vtx[2]);
     
    glVertex3fv(vtx[0]);

     
    glVertex3fv(vtx[10]);
    
    glVertex3fv(vtx[11]);
      
    glVertex3fv(vtx[5]);
     
    glVertex3fv(vtx[4]);

     
    glVertex3fv(vtx[1]);
    
    glVertex3fv(vtx[3]);
      
    glVertex3fv(vtx[9]);
     
    glVertex3fv(vtx[7]);

       
    glVertex3fv(vtx[0]);
        
    glVertex3fv(vtx[1]);
        
    glVertex3fv(vtx[7]);
     
    glVertex3fv(vtx[6]);

     
    glVertex3fv(vtx[3]);
    
    glVertex3fv(vtx[5]);
      
    glVertex3fv(vtx[11]);
     
    glVertex3fv(vtx[9]);
    glEnd();

    glBegin(GL_POLYGON);
       
    glVertex3fv(vtx[6]);
        
    glVertex3fv(vtx[7]);
        
    glVertex3fv(vtx[9]);
     
    glVertex3fv(vtx[11]);
    
    glVertex3fv(vtx[10]);
      
    glVertex3fv(vtx[8]);
    glEnd();

    glEnd();

    glPopMatrix();

}

void display(void){

    glClear(GL_COLOR_BUFFER_BIT);
    glClearColor(1.0, 0.5, 0.0, 1.0);
    glutWireCube(current_gs->cubesize);
    glMatrixMode(GL_PROJECTION);

    glFrontFace(GL_CCW);
    glPolygonMode(GL_FRONT, GL_FILL);
    glPolygonMode(GL_BACK, GL_FILL);

    drawCube2(5, 0, 0); //sun
    drawCube2(30,4, 1); //mer
    drawCube2(25,6.5, 2); //ven
    drawCube2(20, 9, 3); //earth
    drawCube2(15, 10, 4); //mar
    drawCube2(10, 12, 5); //jep
    drawCube2(5, 13, 6); //sat
    drawCube2(3, 14, 7); //ura
    drawCube2(1, 20, 8); //nep

    //drawTest();

    glutSwapBuffers();
    glFlush();

}

void
reshape(int w, int h){

    if(w<1) w=1;
    if(h<1) h=1;
    glViewport(0,0,w,h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    if(w<=h)
        glOrtho(-30.0,30.0,-30.0*(GLfloat)h/(GLfloat)w,30.0*(GLfloat)h/(GLfloat)w,-50.0,50.0);
    else
        glOrtho(-30.0*(GLfloat)w/(GLfloat)h,30.0*(GLfloat)w/(GLfloat)h,-30.0,30.0,-50.0,50.0);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

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




