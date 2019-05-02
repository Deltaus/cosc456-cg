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
GC.width = 640;                   //render area width
GC.height = 480;                  //render area height

GC.textureCoordBuffer = null;
GC.textureCoordAttributeLocation = null;
GC.uSamplerLocation = null;
GC.mvUniformLocation = null;
GC.pUniformLocation = null;

GC.indexBuffer = null;
GC.indices = null;

GC.uSamp = null;

GC.lightPosition = [5.0, 1.0, 1.0];
GC.lightVec = new Float32Array(3);
GC.ambientColor = [0.2, 0.1, 0.3];
GC.specularColor = [1.0, 1.0, 1.0];
GC.shVal = 1.0;
GC.kaVal = 1.0;
GC.kdVal = 1.0;
GC.ksVal = 1.0;
GC.lsX = 0.0;
GC.lsY = 0.0;
GC.lsZ = 0.0;

var nMatrix = mat4.create();

var params;
var sphereData;
var sphereModel;
var sphereTexture;
var sphereMap;

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

    loadTexture();
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
    params.textureAttributeLocation = gl.getAttribLocation(this.shaderProgram, "a_textCoords");
    params.vertexNormalAttributeLocation = gl.getAttribLocation(this.shaderProgram, "vNorm");

    params.pUniformLocation = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    params.mvUniformLocation = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    params.uSamplerLocation = gl.getUniformLocation(this.shaderProgram, "u_texture");
    params.nUniformLocation = gl.getUniformLocation(this.shaderProgram, "uNMatrix");

    params.kaLocation = gl.getUniformLocation(this.shaderProgram, "ka");
    params.kdLocation = gl.getUniformLocation(this.shaderProgram, "kd");
    params.ksLocation = gl.getUniformLocation(this.shaderProgram, "ks");
    params.shLocation = gl.getUniformLocation(this.shaderProgram, "sh");
    params.ambientColorLocation = gl.getUniformLocation(this.shaderProgram, "ambientColor");
    params.specularColorLocation = gl.getUniformLocation(this.shaderProgram, "specularColor");
    params.lightPositionLocation = gl.getUniformLocation(this.shaderProgram, "lightPosition");

}

//initialize the buffers for drawing and the edge highlights
demo.prototype.initGeometryBuffers = function(){
  //var verts = [];                   //array to hold vertices laid out according to indices
  //var tCoord = [];                    //array of 1s and 0s passed to GLSL to draw wireframe


    var sphereData_temp = uvSphere(0.6, 64, 32);
    var sphereData = {
        vertexPositions: new Float32Array(sphereData_temp.vertexPositions),
        vertexTextureCoords: new Float32Array(sphereData_temp.vertexTextureCoords),
        indices: new Uint16Array(sphereData_temp.indices),
        vertexNormals: new Float32Array(sphereData_temp.vertexNormals)
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
    sphereModel = this.createModel(sphereData);
}

//the drawing function
function drawScene(){

    if (!sphereMap) {  // can't do anything if skybox isn't ready to render.
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
    GC.lightPosition[0] = GC.lsX;
    GC.lightPosition[1] = GC.lsY;
    GC.lightPosition[2] = GC.lsZ;

    if(params.kaLocation != null) gl.uniform1f(params.kaLocation, GC.kaVal);
    if(params.kdLocation != null) gl.uniform1f(params.kdLocation, GC.kdVal);
    if(params.ksLocation != null) gl.uniform1f(params.ksLocation, GC.ksVal);
    if(params.shLocation != null) gl.uniform1f(params.shLocation, GC.shVal);
    if(params.ambientColorLocation != null) gl.uniform3fv(params.ambientColorLocation, GC.ambientColor);
    if(params.specularColorLocation != null) gl.uniform3fv(params.specularColorLocation, GC.specularColor);
    if(params.lightPositionLocation != null) gl.uniform3fv(params.lightPositionLocation, GC.lightPosition);

    //GC.texture = loadTexture("./imagefiles/UT.jpg");
    gl.useProgram(GC.shaderProgram);
    gl.enableVertexAttribArray(params.vertexPositionAttributeLocation);
    gl.enableVertexAttribArray(params.textureAttributeLocation);
    gl.enableVertexAttribArray(params.vertexNormalAttributeLocation);
    sphereModel.render();
    gl.disableVertexAttribArray(params.vertexPositionAttributeLocation);
    gl.disableVertexAttribArray(params.textureAttributeLocation);
    gl.disableVertexAttribArray(params.vertexNormalAttributeLocation);

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

    //loadTexture();
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
    model.textCoordBuffer = gl.createBuffer();
    model.vertexBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.count = modelData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.textCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);

    model.render = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(params.vertexPositionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
        gl.vertexAttribPointer(params.textureAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(params.vertexNormalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(params.mvUniformLocation, false, new Float32Array(GC.mvMatrix.flatten()));
        gl.uniformMatrix4fv(params.pUniformLocation, false, new Float32Array(GC.perspectiveMatrix.flatten()));
        gl.uniformMatrix4fv(params.nUniformLocation, false, nMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
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

    sphereMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, sphereMap);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, sphereMap);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        drawScene();
    };
    image.src = "./imagefiles/Power-T-transparent.png";

}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}