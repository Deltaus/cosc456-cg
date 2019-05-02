var gl = null; //our OpenGL handler

var GC = {};   //the graphics context

var envUrl = [
    "imagefiles/glacier_rt.jpg",
    "imagefiles/glacier_lf.jpg",
    "imagefiles/glacier_dn.jpg",
    "imagefiles/glacier_up.jpg",
    "imagefiles/glacier_ft.jpg",
    "imagefiles/glacier_bk.jpg"
];

//initialize the graphics context variables
GC.shaderProgram = null;          //our GLSL program

GC.vertexPositionAttributeLocation = null;//location of vertex positions in GLSL program

GC.perspectiveMatrix = null;      //the Perspective matrix
GC.mvMatrix = null;               //the ModelView matrix
GC.mvMatrixStack = [];            //the ModelView matrix stack
GC.mesh = null;                   //the current mesh
GC.mouseDown = null;              //boolean check for mouseDown
GC.width = 960;                   //render area width
GC.height = 720;                  //render area height

GC.textureCoordBuffer = null;
GC.textureCoordAttributeLocation = null;
GC.uSamplerLocation = null;
GC.mvUniformLocation = null;
GC.pUniformLocation = null;

GC.indexBuffer = null;
GC.indices = null;

GC.uSamp = null;

var normalMatrix = mat3.create();
var params;
var cubeData;
var cubeModel;
var cubeTexture;
var cubeMap;

var camera = new ArcBall();              //create a new arcball camera
camera.setBounds(GC.width,GC.height);    //initialize camera with screen space dimensions


//demo constructor
function demo(canvasName) {
    this.canvasName = canvasName;
}

//initialize webgl, populate all buffers, load shader programs, and start drawing
demo.prototype.init = function(){
    this.canvas = document.getElementById(this.canvasName);
    this.canvas.width = GC.width;
    this.canvas.height = GC.height;

    //Here we check to see if WebGL is supported 
    this.initWebGL(this.canvas);

    gl.clearColor(0.0,0.0,0.0,1.0);     //background to black
    gl.clearDepth(1.0);                 //set depth to yon plane
    gl.enable(gl.DEPTH_TEST);           //enable depth test
    gl.depthFunc(gl.LEQUAL);            //change depth test to use LEQUAL

    //set mouse event callbacks
    this.setMouseEventCallbacks();

    //set keyboard event callbacks
    this.setKeyboardEventCallbacks();

    //Get opengl derivative extension -- enables using fwidth in shader
    gl.getExtension("OES_standard_derivatives");
    
    //init the shader programs
    this.initShaders();

    //init the vertex buffer
    this.initGeometryBuffers();
}

demo.prototype.MainLoop = function(){
    drawScene();
}

demo.prototype.setMouseEventCallbacks = function(){
    //-------- set callback functions
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmousewheel = this.mouseWheel;

        //--Why set these to callbacks for the document object?
    document.onmouseup = this.mouseUp;          
    document.onmousemove = this.mouseMove;
    
        //--touch event callbacks
    this.canvas.ontouchstart = this.touchDown;
    this.canvas.ontouchend = this.touchUp;
    this.canvas.ontouchmove = this.touchMove;
    //-------- end set callback functions
}

demo.prototype.setKeyboardEventCallbacks = function(){
        //--Why set these to callbacks for the document object?
    document.onkeydown = this.keyDown;          
}

//initialize the shaders and grab the shader variable attributes
demo.prototype.initShaders = function(){

    //Load the shaders
    var fragmentShader = this.getShader("FragmentShader1");
    var vertexShader = this.getShader("VertexShader1");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);
    GC.shaderProgram = this.shaderProgram;

    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)){
        console.log("unable to init shader program");
    }

    params = {};
    gl.useProgram(this.shaderProgram);
    params.vertexPositionAttributeLocation = gl.getAttribLocation(this.shaderProgram, "vPos");
    params.normalAttributeLocation = gl.getAttribLocation(this.shaderProgram, "a_normal");
    params.pUniformLocation = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    params.mvUniformLocation = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

    params.uSamplerLocation = gl.getUniformLocation(this.shaderProgram, "u_texture");
    params.nUniformLocation = gl.getUniformLocation(this.shaderProgram, "u_nMatrix");
    params.camUniformLocation = gl.getUniformLocation(this.shaderProgram, "u_camPos");
    gl.uniform1i(params.uSamplerLocation, 0);

    cubeMap = gl.createTexture();
}

//initialize the buffers for drawing and the edge highlights
demo.prototype.initGeometryBuffers = function(){
  //var verts = [];                   //array to hold vertices laid out according to indices
  //var tCoord = [];                    //array of 1s and 0s passed to GLSL to draw wireframe

  const verts = [
      // Front face
      -0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
      0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
      0.5,  0.5,  -0.5,
      0.5, -0.5,  -0.5,

      -0.5, -0.5,   0.5,
      0.5, -0.5,   0.5,
      -0.5,  0.5,   0.5,
      -0.5,  0.5,   0.5,
      0.5, -0.5,   0.5,
      0.5,  0.5,   0.5,

      -0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
      0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
      0.5,   0.5,  0.5,
      0.5,   0.5, -0.5,

      -0.5,  -0.5, -0.5,
      0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,  -0.5,  0.5,
      0.5,  -0.5, -0.5,
      0.5,  -0.5,  0.5,

      -0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5,  0.5,
      -0.5,   0.5, -0.5,

      0.5,  -0.5, -0.5,
      0.5,   0.5, -0.5,
      0.5,  -0.5,  0.5,
      0.5,  -0.5,  0.5,
      0.5,   0.5, -0.5,
      0.5,   0.5,  0.5,
  ];

  const norms = [
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
  ];

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    cubeData = {
        vertexIndices: new Uint16Array(indices),
        vertexPositions: new Float32Array(verts),
        vertexNormals: new Float32Array(norms)
    }

    const min = [-2, -2, -2];
    const max = [2, 2, 2];
    //set the min/max variables
    GC.minX = min[0]; GC.minY = min[1]; GC.minZ = min[2];
    GC.maxX = max[0]; GC.maxY = max[1]; GC.maxZ = max[2];

  //calculate the largest range in x,y,z
    var s = Math.max( Math.abs(min[0]-max[0]),
                    Math.abs(min[1]-max[1]),
                    Math.abs(min[2]-max[2]))

  //calculate the distance to place camera from model
    var d = (s/2.0)/Math.tan(45/2.0);

  //place the camera at the calculated position
    camera.position[2] = d;

  //orient the camera to look at the center of the model
    camera.lookAt = [(GC.minX+GC.maxX)/2.0,(GC.minY+GC.maxY)/2.0,(GC.minZ+GC.maxZ)/2.0];

    gl.useProgram(GC.shaderProgram);
    cubeModel = this.createModel(cubeData);
}

//the drawing function
function drawScene(){

    if (!cubeMap) {  // can't do anything if skybox isn't ready to render.
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return;
    }


    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //setup perspective and lookat matrices
    GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,GC.maxZ));
    var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
                                  camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
                                  0,1,0);

    //set initial camera lookat matrix
    mvLoadIdentity(GC);

    //multiply by our lookAt matrix
    mvMultMatrix(lookAtMatrix,GC);

//--------- camera rotation matrix multiplicaton
    //translate to origin of model for rotation
    mvTranslate([(GC.minX+GC.maxX)/2.0,(GC.minY+GC.maxY)/2.0,(GC.minZ+GC.maxZ)/2.0],GC);

    mvMultMatrix(camera.Transform,GC);//multiply by the transformation

    //translate back to original origin
    mvTranslate([-(GC.minX+GC.maxX)/2.0,-(GC.minY+GC.maxY)/2.0,-(GC.minZ+GC.maxZ)/2.0],GC);
//---------

    //passes modelview and projection matrices to the vertex shader
    //setMatrixUniforms(GC);

    //GC.texture = loadTexture("./imagefiles/UT.jpg");
    gl.useProgram(GC.shaderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.enableVertexAttribArray(params.vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(params.normalAttributeLocation);
    cubeModel.render();
    gl.disableVertexAttribArray(params.vertexPositionAttributeLocation);
    gl.disableVertexAttribArray(params.normalAttributeLocation);

}

//initialize webgl
demo.prototype.initWebGL = function(){
    gl = null;

    try {
        gl = this.canvas.getContext("experimental-webgl");
    }
    catch(e) {
        //pass through
    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    loadTexture();
}

//compile shader located within a script tag
demo.prototype.getShader = function(id){
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);
    if(!shaderScript){
        return null;
    }

    //init the source code variable
    theSource = "";

    //begin reading the shader source from the beginning
    currentChild = shaderScript.firstChild;

    //read the shader source as text
    while(currentChild){
        if(currentChild.nodeType == currentChild.TEXT_NODE){
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    //check type of shader to give openGL the correct hint
    if(shaderScript.type == "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if(shaderScript.type == "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    
    //add the shader source code to the created shader object
    gl.shaderSource(shader, theSource);

    //compile the shader
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log("error compiling shaders -- " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

demo.prototype.createModel = function(modelData) {  // For creating the reflecting shuttle models.

    var model = {};
    model.normalBuffer = gl.createBuffer();
    model.vertexBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.vertexIndices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.vertexIndices, gl.STATIC_DRAW);

    model.render = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(params.vertexPositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(params.normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(params.mvUniformLocation, false, new Float32Array(GC.mvMatrix.flatten()));
        gl.uniformMatrix4fv(params.pUniformLocation, false, new Float32Array(GC.perspectiveMatrix.flatten()));

        gl.uniform3fv(params.camUniformLocation, camera.position);
        gl.uniformMatrix3fv(params.nUniformLocation, false, normalMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    };
    return model;
}


//handle mousedown
demo.prototype.mouseDown = function(event){
    GC.mouseDown = true;

    //update the base rotation so model doesn't jerk around upon new clicks
    camera.LastRot = camera.ThisRot;
    camera.click(event.clientX,event.clientY);

    return false;
}

//handle mouseup
demo.prototype.mouseUp = function(event){
    GC.mouseDown = false;
    return false;
}

//handle mouse movement
demo.prototype.mouseMove = function(event){
    if(GC.mouseDown == true){
       X = event.clientX;
       Y = event.clientY;

       //call camera function for handling mouse movement
       camera.move(X,Y)

       drawScene();
    }
    return false;
}

//handle mouse scroll event
demo.prototype.mouseWheel = function(event){
    camera.zoomScale -= event.wheelDeltaY*0.0005;
    camera.Transform.elements[3][3] = camera.zoomScale;

    drawScene();
    return false;
}


//--------- handle keyboard events
demo.prototype.keyDown = function(e){
    camera.LastRot = camera.ThisRot;
    var center = {x: GC.width/2, y:GC.height/2}; 
    var delta = 8;

    switch(e.keyCode){
        case 37: //Left arrow
            camera.click(center.x, center.y);
            camera.move(center.x - delta, center.y);
        break;
        case 38: //Up arrow
            camera.click(center.x, center.y);
            camera.move(center.x, center.y - delta);
        break;
        case 39: //Right arrow
            camera.click(center.x, center.y);
            camera.move(center.x + delta, center.y);
        break;
        case 40: //Down arrow
            camera.click(center.x, center.y);
            camera.move(center.x, center.y + delta);
        break;
    }

    //redraw
    drawScene();
}


// --------- handle touch events
demo.prototype.touchDown = function(event){
    GC.mouseDown = true;

    //update the base rotation so model doesn't jerk around upon new clicks
    camera.LastRot = camera.ThisRot;

    //tell the camera where the touch event happened
    camera.click(event.changedTouches[0].pageX,event.changedTouches[0].pageY);

    return false;
}

//handle touchEnd
demo.prototype.touchUp = function(event){
    GC.mouseDown = false;
    return false;
}

//handle touch movement
demo.prototype.touchMove = function(event){
    if(GC.mouseDown == true){
        X = event.changedTouches[0].pageX;
        Y = event.changedTouches[0].pageY;

       //call camera function for handling mouse movement
       camera.move(X,Y)

       drawScene();
    }
    return false;
}
// --------- end handle touch events

function loadTexture() {

    var ct = 0;
    var img = new Array(6);
    var urls = envUrl;
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function() {
            ct++;
            if (ct == 6) {
                cubeMap = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
                var targets = [
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                try {
                    for (var j = 0; j < 6; j++) {
                        gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    }
                } catch(e) {

                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                drawScene();
            }
        }
        img[i].src = urls[i];
    }

}