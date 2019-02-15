cmake_minimum_required(VERSION 3.8)
project(lab0)

set(CMAKE_C_STANDARD 99)

set(GLEW_H /usr/local/Cellar/glew/2.1.0/include/GL)
set(GLFW_H /usr/local/Cellar/glfw/3.2.1/include/GLFW)
include_directories(${GLEW_H} ${GLFW_H})


find_library(OPENGL OpenGL)
set(GLEW_LINK /usr/local/Cellar/glew/2.1.0/lib/libGLEW.2.1.dylib)
set(GLFW_LINK /usr/local/Cellar/glfw/3.2.1/lib/libglfw.3.dylib)
link_libraries(${OPENGL} ${GLEW_LINK} ${GLFW_LINK})

#find_package(OpenGL REQUIRED)
#include_directories(${OPENGL_INCLUDE_DIR})

#find_package(GLUT REQUIRED)
#include_directories(${GLUT_INCLUDE_DIR})

#set(SOURCE_FILES library.c library.h jmesh.h offreader.h offreader.cpp jmesh.cpp main.cpp)
set(SOURCE_FILES utils.h utils.cpp hello.cpp)
add_executable(lab0 ${SOURCE_FILES})