# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.8

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CLion.app/Contents/bin/cmake/bin/cmake

# The command to remove a file.
RM = /Applications/CLion.app/Contents/bin/cmake/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug

# Include any dependencies generated for this target.
include CMakeFiles/lab0.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/lab0.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/lab0.dir/flags.make

CMakeFiles/lab0.dir/utils.cpp.o: CMakeFiles/lab0.dir/flags.make
CMakeFiles/lab0.dir/utils.cpp.o: ../utils.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/lab0.dir/utils.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/lab0.dir/utils.cpp.o -c /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/utils.cpp

CMakeFiles/lab0.dir/utils.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/lab0.dir/utils.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/utils.cpp > CMakeFiles/lab0.dir/utils.cpp.i

CMakeFiles/lab0.dir/utils.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/lab0.dir/utils.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/utils.cpp -o CMakeFiles/lab0.dir/utils.cpp.s

CMakeFiles/lab0.dir/utils.cpp.o.requires:

.PHONY : CMakeFiles/lab0.dir/utils.cpp.o.requires

CMakeFiles/lab0.dir/utils.cpp.o.provides: CMakeFiles/lab0.dir/utils.cpp.o.requires
	$(MAKE) -f CMakeFiles/lab0.dir/build.make CMakeFiles/lab0.dir/utils.cpp.o.provides.build
.PHONY : CMakeFiles/lab0.dir/utils.cpp.o.provides

CMakeFiles/lab0.dir/utils.cpp.o.provides.build: CMakeFiles/lab0.dir/utils.cpp.o


CMakeFiles/lab0.dir/hello.cpp.o: CMakeFiles/lab0.dir/flags.make
CMakeFiles/lab0.dir/hello.cpp.o: ../hello.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/lab0.dir/hello.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/lab0.dir/hello.cpp.o -c /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/hello.cpp

CMakeFiles/lab0.dir/hello.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/lab0.dir/hello.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/hello.cpp > CMakeFiles/lab0.dir/hello.cpp.i

CMakeFiles/lab0.dir/hello.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/lab0.dir/hello.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/hello.cpp -o CMakeFiles/lab0.dir/hello.cpp.s

CMakeFiles/lab0.dir/hello.cpp.o.requires:

.PHONY : CMakeFiles/lab0.dir/hello.cpp.o.requires

CMakeFiles/lab0.dir/hello.cpp.o.provides: CMakeFiles/lab0.dir/hello.cpp.o.requires
	$(MAKE) -f CMakeFiles/lab0.dir/build.make CMakeFiles/lab0.dir/hello.cpp.o.provides.build
.PHONY : CMakeFiles/lab0.dir/hello.cpp.o.provides

CMakeFiles/lab0.dir/hello.cpp.o.provides.build: CMakeFiles/lab0.dir/hello.cpp.o


# Object files for target lab0
lab0_OBJECTS = \
"CMakeFiles/lab0.dir/utils.cpp.o" \
"CMakeFiles/lab0.dir/hello.cpp.o"

# External object files for target lab0
lab0_EXTERNAL_OBJECTS =

lab0: CMakeFiles/lab0.dir/utils.cpp.o
lab0: CMakeFiles/lab0.dir/hello.cpp.o
lab0: CMakeFiles/lab0.dir/build.make
lab0: /usr/local/Cellar/glew/2.1.0/lib/libGLEW.2.1.dylib
lab0: /usr/local/Cellar/glfw/3.2.1/lib/libglfw.3.dylib
lab0: CMakeFiles/lab0.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable lab0"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/lab0.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/lab0.dir/build: lab0

.PHONY : CMakeFiles/lab0.dir/build

CMakeFiles/lab0.dir/requires: CMakeFiles/lab0.dir/utils.cpp.o.requires
CMakeFiles/lab0.dir/requires: CMakeFiles/lab0.dir/hello.cpp.o.requires

.PHONY : CMakeFiles/lab0.dir/requires

CMakeFiles/lab0.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/lab0.dir/cmake_clean.cmake
.PHONY : CMakeFiles/lab0.dir/clean

CMakeFiles/lab0.dir/depend:
	cd /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0 /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0 /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug /Users/deltau/MyProjects/GitHub/COSC456/dsun12/lab0/cmake-build-debug/CMakeFiles/lab0.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/lab0.dir/depend

