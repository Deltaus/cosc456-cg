cmake_minimum_required(VERSION 3.8)
project(lab0)

set(CMAKE_C_STANDARD 99)

set(SOURCE_FILES library.c library.h jmesh.h offreader.h offreader.cpp jmesh.cpp main.cpp)
add_executable(lab0 ${SOURCE_FILES})