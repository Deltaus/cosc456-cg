cmake_minimum_required(VERSION 3.8)
project(lab0)

find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIR})

find_package(GLUT REQUIRED)
include_directories(${GLUT_INCLUDE_DIR})

set(CMAKE_CXX_FLAGS "-g -Wall")

#add_executable(lab0 solarSystem.cpp)
add_executable(lab0 main.cpp jmesh.h jmesh.cpp offreader.h offreader.cpp library.h library.c)
#add_executable(lab0 hello.cpp jmesh.h jmesh.cpp offreader.h offreader.cpp library.h library.c utils.h utils.cpp)
target_link_libraries(lab0 ${GLUT_LIBRARY} ${OPENGL_LIBRARY})