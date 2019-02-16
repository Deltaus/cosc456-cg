Repo for COSC456
Lab1(0)

STEP0: implement jmesh.[c,h] as the common API for loading mesh files,
and offreader.[c,h] as the internal module that specifically loads OFF
mesh files. Your OFF file reader must be robust enough to handle variations
in the file, and must handle the three OFF files given under the off/ directory.

STEP1: for the loaded mesh, print out the number of vertices,
number of triangles, and calculate the bounding box, i.e. min/max_x, min
/max_y, min/max_z, and the centroid, i.e. average x, y and z. 
Print out those values on console. 

STEP2: compile and build your first OpenGL program, referencing the
skeleton code. In this step, add a single key function - "Q" or "q" for
quitting the program.

STEP3: set up lab1 to open a GLUT window with background cleared to
orange color in the display callback. Then read back the framebuffer using 
glReadPixels in the display callback, and write out the framebuffer in PPM 
format (referencing your CS302 lab1 would be fine).  In key callback, add 
the switch to this function through "S" and "s".  HINT: when using glReadPixels,
the pixels are y-inverted, so your image may appear upside down at first.

STEP4: set up camera using gluLookAt and render the object as wireframe by 
setting glPolygonMode as glPolygonMode(GL_FRONT_AND_BACK, GL_LINE). Set up 
the camera to look at the center of the object.

STEP5: create an OFF file specifying the mesh representing a cube that 
spans (0,0,0) and (1,1,1). 

STEP6: render a solar system using one single cube OFF file (i.e. your
sun and planets are represented as cubes). Objects are to be moved around
through matrix transformations.

Lab2:
Step0: become familiar with the demo package, understand the skeleton structure 
of the code and the data structure, especially how the triangle mesh is stored 
and managed, and experiment with making simple changes.

Step0a: use the sample frag shader in index.php to render the whole mesh to the same color.

Step0b: use the sample vert shader in index.php to scale the mesh in x and y directions.

Step1: add an extended normals array in the mesh data structure. Implement 
a javascript function to compute per-vertex normals from the mesh. Note, please do 
not put this functionality within your mesh reader functions. The normals should be 
computed in a separate function that takes the triangle mesh as input.

Step2: change the fragment shader to color each fragment by the per fragment
normal direction. This is not calculating illumination yet. This is a testing step 
- color the RGB compnenents by abs of the corresponding normal.x, normal.y, normal.z, 
respectively.

Step3: implement full Gouraud shading in a new fragment shader.

Step4: implement full Phong shading in a new fragment shader.

Step5: implement a special effect in our fragment shader based on Step4 - to linearly 
modulate the red component of fragment color according to height (y component of 
gl_Position), so that the bottom of the screen or the bottom of the model in screen 
space has zero red component and the top of the model has full red component.

Step6: (extra credit for 456, required for 594) implement an effect similar as Step5 requirements, but do this 
through texture mapping. There are two parts: (1) a function to create an RGB 2D 
texture (8 x 8) that stores a linear ramp from 0 to 255 in two directions (use the 
same values on all components), and (2) when rendering, multiply the fragment color,
as done in Step4, by the texture value looked up from the texture using the y and z 
components of each fragment. The end results should be a height-based and depth-based 
attenuation effect.
