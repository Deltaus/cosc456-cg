//
// Created by Derek Sun on 2019/2/15.
//


#include <iostream>
using namespace std;

#include <cmath>
#include <ctime>
#include "GLUT/glut.h"

static int cnt=0;//回掉函数中的计数值，如果是为了看模拟效果不计算真实周期，cnt的上限随便给一个值就行了

void myTimerFunc(int val);//回掉函数，刷新画面
void drawSun();//绘制太阳
void drawMercury();//绘制水星
void drawVenus();//绘制金星
void drawEarth();//绘制地球
void drawMoon();//绘制月亮
void drawMars();//绘制火星
void drawJupiter();//绘制木星
void drawSaturn();//绘制土星
void drawUranus();//绘制天王星
void drawNeptune();//绘制海王星
void drawOrbit(unsigned int para);//用来绘制轨道
void myDisplay();//在main里调用，显示绘制结果

void myTimerFunc(int val){
    cnt++;
    if(cnt>=500)//上限500到了就清零
        cnt=0;
    myDisplay();
    glutTimerFunc(10,myTimerFunc,0);//第一个参数设置成10，太小了刷新太快，不利于观察
}

void drawSun(){
    glPushMatrix();
    glColor4f(1.0,0.0,0.0,0.1);//红色
    glRotatef(cnt,0.0,0.0,-1.0);
    glutSolidSphere(18000000,30,30);
    glPopMatrix();
}

void drawMercury(){
    glPushMatrix();
    glColor4f(0.0,1.0,1.0,0.8);//青色
    glRotatef(3.0*cnt,-0.0,0.0,-1.0);//第一个参数适当放大些，因为水星的公转是最快的
    glTranslatef(40000000.0,0.0,0.0);
    glutSolidSphere(9000000,30,30);
    glPopMatrix();
    drawOrbit(44500000);//画轨道
}

void drawVenus(){
    glPushMatrix();
    glColor4f(1.00,0.89,0.0,1.0);//金黄
    glRotatef(2.5*cnt,0.0,0.0,-1.0);
    glTranslatef(65000000,0.0,0.0);
    glutSolidSphere(11000000,30,30);
    glPopMatrix();
    drawOrbit(65000000);//画轨道
}

void drawEarth(){
    glPushMatrix();
    glColor4f(0.0,0.0,1.0,0.8);//蓝色
    glRotatef(2.0*cnt,0.0,0.0,-1.0);
    glTranslatef(90000000,0.0,0.0);
    glutSolidSphere(10000000,30,30);
    glPopMatrix();
    drawOrbit(90000000);//画轨道
}

void drawMoon(){
    glPushMatrix();
    glColor4f(1.0,1.0,1.0,1.0);//白色
    glRotatef(2.0*cnt,0.0,0.0,-1.0);
    glTranslatef(110000000,0.0,0.0);
    glutSolidSphere(4000000,30,30);
    glPopMatrix();
}

void drawMars(){
    glPushMatrix();
    glColor4f(1.00,0.89,0.4,1.0);//黄色偏淡
    glRotatef(1.4*cnt,0.0,0.0,-1.0);
    glTranslatef(100000000,0.0,0.0);
    glutSolidSphere(6000000,30,30);
    glPopMatrix();
    drawOrbit(100000000);//画轨道
}

void drawJupiter(){
    glPushMatrix();
    glColor4f(1.00,0.89,0.4,1.0);//黄色偏淡
    glRotatef(1.2*cnt,0.0,0.0,-1.0);
    glTranslatef(110000000,0.0,0.0);
    glutSolidSphere(9000000,20,20);
    glPopMatrix();
    drawOrbit(110000000);//画轨道
}

void drawSaturn(){
    glPushMatrix();
    glColor4f(1.0,1.0,0.0,1.0);//黄色
    glRotatef(1.1*cnt,0.0,0.0,-1.0);
    glTranslatef(120000000,0.0,0.0);
    glutSolidSphere(7000000,20,20);
    glutSolidTorus(1000000,11000000,30,30);//绘制木星的“圆环”
    glPopMatrix();
    drawOrbit(120000000);//画轨道
}

void drawUranus(){
    glPushMatrix();
    glColor4f(0.0,0.3,1.0,0.5);//青蓝色
    glRotatef(cnt,0.0,0.0,-1.0);
    glTranslatef(130000000,0.0,0.0);
    glutSolidSphere(8000000,20,20);
    glPopMatrix();
    drawOrbit(130000000);//画轨道
}

void drawNeptune(){
    glPushMatrix();
    glColor4f(0.0,0.82,1.0,0.5);//青蓝色偏淡
    glRotatef(0.7*cnt,0.0,0.0,-1.0);//考虑到海王星转得最慢，第一个参数最后减到0.7*cnt
    glTranslatef(140000000,0.0,0.0);
    glutSolidSphere(8000000,20,20);
    glPopMatrix();
    drawOrbit(140000000);//画轨道
}

void drawOrbit(unsigned int para){
    glPushMatrix();
    glColor4f(1.0,1.0,1.0,0.5);
    glutSolidTorus(100000,para,30,30);//用一个圆环来模拟轨道
    glPopMatrix();
}

void myDisplay(){
    glClear(GL_COLOR_BUFFER_BIT);//刷新颜色缓冲
    glMatrixMode(GL_PROJECTION);//投影模式
    glLoadIdentity();//加载单位阵
    gluPerspective(62.0,1.0,1,100000000);//透视相关
    glMatrixMode(GL_MODELVIEW);//模型试图
    glLoadIdentity();
    gluLookAt(0,-200000000,200000000,0,0,0,0,0,1);//试点转换
    //调用画星球的函数
    drawSun();
    drawMercury();
    drawVenus();
    drawEarth();
    drawMoon();
    drawMars();
    drawJupiter();
    drawSaturn();
    drawUranus();
    drawNeptune();
    glutSwapBuffers();//交换缓冲区
}

int main(int argc,char *argv[]){
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_RGBA|GLUT_DOUBLE);
    glutInitWindowSize(500,500);
    glutCreateWindow("???");
    glutDisplayFunc(&myDisplay);
    glutTimerFunc(10,myTimerFunc,0);
    glutMainLoop();
    return 0;
}

