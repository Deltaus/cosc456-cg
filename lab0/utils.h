//
// Created by Derek Sun on 2019/2/14.
//

#ifndef LAB0_UTILS_H
#define LAB0_UTILS_H

#include "jmesh.h"

typedef struct {
    int width;        /* width of rendering target */
    int height;       /* height of rendering target */
    double cubesize;  /* size of cube - for playing with */
} graphics_state;   /* global graphics state */

#ifdef __cplusplus
extern "C" {
#endif

extern GLfloat vtx[72][3];

void print_howto(void);
void init(graphics_state *);
void set_gs(graphics_state *);

void display(void);
void reshape(int w, int h);
void mouse_handler(int button, int button_state, int x, int y);
void trackMotion(int x, int y);
void keys(unsigned char c,int x, int y);

/* GLSL specific functions */
char*textFileRead(char *fn);
int  load_shader(GLuint shader, GLchar * source);
int  init_GLSL(char * vert_source, char * frag_source);

jmesh * readOffFile(const char * filename);
void printMesh(const jmesh *);
void drawCube2(int speed, float dist, int index);

#ifdef __cplusplus
}
#endif

















#endif //LAB0_UTILS_H
