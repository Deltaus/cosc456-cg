var gl = null; //our OpenGL handler
//var ctx = null;

var GC = {};   //the graphics context

var envUrl = [
    "imagefiles/posx.jpg",
    "imagefiles/negx.jpg",
    "imagefiles/posy.jpg",
    "imagefiles/negy.jpg",
    "imagefiles/posz.jpg",
    "imagefiles/negz.jpg"
];

//initialize the graphics context variables
GC.shaderProgram = null;          //our GLSL program
GC.vertexPositionAttribute = null;//location of vertex positions in GLSL program
GC.perspectiveMatrix = null;      //the Perspective matrix
GC.mvMatrix = null;               //the ModelView matrix
GC.mvMatrixStack = [];            //the ModelView matrix stack
GC.mesh = null;                   //the current mesh
GC.mouseDown = null;              //boolean check for mouseDown
GC.width = 960;                   //render area width
GC.height = 720;                  //render area height


var rotX = 0;
var rotY = 0;
var projection = mat4.create();
var normalMatrix = mat3.create();;
var inverseViewTransform = mat3.create();;
var rotator;
var modelview;

var shuttleData;
var shuttle;
var skyboxCube;
var frameData = null;
var frameModel;

var skyboxParams;
var shuttleParams;
var framesParams;

var floatingFramesData;
var skyboxCubeMap;
var dynamicCubeMap;
var cubemapTargets;
var frameBuffer;
var fNum = 0;
var anm = true;


var camera = new ArcBall();              //create a new arcball camera
camera.setBounds(GC.width,GC.height);    //initialize camera with screen space dimensions


//demo constructor
function demo(canvasName,Mesh) {
    this.canvasName = canvasName;
    GC.mesh = Mesh.model;
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
    //gl.enable(gl.DEPTH_TEST);           //enable depth test
    gl.depthFunc(gl.LEQUAL);            //change depth test to use LEQUAL

    //set mouse event callbacks
    this.setMouseEventCallbacks();
    //set keyboard event callbacks
    this.setKeyboardEventCallbacks();
    //Get opengl derivative extension -- enables using fwidth in shader
    gl.getExtension("OES_standard_derivatives");
    
    //init the shader programs
    this.initShaders();

}

demo.prototype.MainLoop = function(){
    drawScene();
}

//initialize the shaders and grab the shader variable attributes
demo.prototype.initShaders = function(){

    cubemapTargets = [
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];

    gl.enable(gl.DEPTH_TEST);

    skyboxParams = {};
    skyboxParams.prog = this.programCreator(gl, "vshader-skybox", "fshader-skybox");
    skyboxParams.a_vertexPositionLocation =  gl.getAttribLocation(skyboxParams.prog, "a_Pos");
    skyboxParams.u_modelviewLocation = gl.getUniformLocation(skyboxParams.prog, "uMVMatrix");
    skyboxParams.u_projectionLocation = gl.getUniformLocation(skyboxParams.prog, "uPMatrix");
    skyboxParams.u_skyboxLocation = gl.getUniformLocation(skyboxParams.prog, "skybox");
    gl.useProgram(skyboxParams.prog);
    gl.uniform1i(skyboxParams.u_skyboxLocation, 0);

    shuttleParams = {};
    shuttleParams.prog = this.programCreator(gl, "vshader-obj", "fshader-obj");
    shuttleParams.a_vertexPositionLocation =  gl.getAttribLocation(shuttleParams.prog, "a_Pos");
    shuttleParams.a_normalLocation =  gl.getAttribLocation(shuttleParams.prog, "a_Norm");
    shuttleParams.u_modelviewLocation = gl.getUniformLocation(shuttleParams.prog, "uMVMatrix");
    shuttleParams.u_projectionLocation = gl.getUniformLocation(shuttleParams.prog, "uPMatrix");
    shuttleParams.u_normalMatrixLocation = gl.getUniformLocation(shuttleParams.prog, "uNMatrix");
    shuttleParams.u_inverseViewTransformLocation = gl.getUniformLocation(shuttleParams.prog, "uIVTMatrix");
    shuttleParams.u_skyboxLocation = gl.getUniformLocation(shuttleParams.prog, "skybox");
    gl.useProgram(shuttleParams.prog);
    gl.uniform1i(shuttleParams.u_skyboxLocation, 0);

    framesParams = {};
    framesParams.prog = this.programCreator(gl, "vshader-frm", "fshader-frm");
    framesParams.a_vertexPositionLocation =  gl.getAttribLocation(framesParams.prog, "a_Pos");
    framesParams.a_normalLocation =  gl.getAttribLocation(framesParams.prog, "a_Norm");
    framesParams.u_modelviewLocation = gl.getUniformLocation(framesParams.prog, "uMVMatrix");
    framesParams.u_projectionLocation = gl.getUniformLocation(framesParams.prog, "uPMatrix");
    framesParams.u_normalMatrixLocation = gl.getUniformLocation(framesParams.prog, "uNMatrix");
    framesParams.u_inverseViewTransformLocation = gl.getUniformLocation(framesParams.prog, "uIVTMatrix");
    framesParams.u_skyboxLocation = gl.getUniformLocation(framesParams.prog, "skybox");
    gl.useProgram(framesParams.prog);
    gl.uniform1i(framesParams.u_skyboxLocation, 0);

    this.initGeometryBuffer();
}

demo.prototype.initGeometryBuffer = function () {

    //create skybox data
    skyboxCube = this.createSkybox( cube(100) );
    //read shuttle data
    shuttleData = {
        vertexPositions: new Float32Array(GC.mesh.vertices),
        vertexNormals: new Float32Array(GC.mesh.vertexNormals),
        vertexTextureCoords: new Float32Array(GC.mesh.textures),
        vertexIndices: new Uint16Array(GC.mesh.indices)
    };
    shuttle = this.createModel(shuttleData, 0);
    //fragments
    frameData = buildFrameData();
    frameModel = this.createModel(frameData, 1);

    skyboxCubeMap = gl.createTexture();
    dynamicCubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubeMap);

    for (var i = 0; i < 6; i++) {
        gl.texImage2D(cubemapTargets[i], 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER,frameBuffer);
    var depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

}

function createFloatingFramesData() {
    floatingFramesData = [];
    for (var i = 0; i <= 50; i++) {
        floatingFramesData.push( {
            translation: [2*i - 10,0,-4],
            localRotationAxis: [Math.random(),Math.random(),Math.random()],
            localAngularVelocity: 0.005 + 0.03*Math.random(),
            globalRotationAxis: [Math.random(),Math.random(),Math.random()],
            globalAngularVelocity: 0.003 + 0.01*Math.random(),
            color: [Math.random(),Math.random(),Math.random()]
        } );
        vec3.normalize(floatingFramesData[i].localRotationAxis, floatingFramesData[i].localRotationAxis);
        vec3.normalize(floatingFramesData[i].globalRotationAxis, floatingFramesData[i].globalRotationAxis);
        if (Math.random() < 0.5) {
            floatingFramesData[i].globalAngularVelocity *= -1;
        }
    }
}

function createDynamicCubeMap() {

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.viewport(0,0,512,512);
    mat4.perspective(projection, Math.PI/2, 1, 1, 100);

    modelview = mat4.create();

    mat4.identity(modelview);
    mat4.scale(modelview,modelview,[-1,-1,1]);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, dynamicCubeMap, 0);
    renderSkyboxAndFrames();

    mat4.identity(modelview);
    mat4.scale(modelview,modelview,[-1,-1,1]);
    mat4.rotateY(modelview,modelview,Math.PI/2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, dynamicCubeMap, 0);
    renderSkyboxAndFrames();

    mat4.identity(modelview);
    mat4.scale(modelview,modelview,[-1,-1,1]);
    mat4.rotateY(modelview,modelview,Math.PI);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, dynamicCubeMap, 0);
    renderSkyboxAndFrames();

    mat4.identity(modelview);
    mat4.scale(modelview,modelview,[-1,-1,1]);
    mat4.rotateY(modelview,modelview,-Math.PI/2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, dynamicCubeMap, 0);
    renderSkyboxAndFrames();

    mat4.identity(modelview);
    mat4.rotateX(modelview,modelview,Math.PI/2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, dynamicCubeMap, 0);
    renderSkyboxAndFrames();

    mat4.identity(modelview);
    mat4.rotateX(modelview,modelview,-Math.PI/2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, dynamicCubeMap, 0);
    renderSkyboxAndFrames();


    gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubeMap);
    gl.generateMipmap( gl.TEXTURE_CUBE_MAP );

}

function renderSkyboxAndFrames() {

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.useProgram(skyboxParams.prog);
    gl.uniformMatrix4fv(skyboxParams.u_projectionLocation, false, projection);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxCubeMap);
    if (skyboxCubeMap) {
        gl.enableVertexAttribArray(skyboxParams.a_vertexPositionLocation);
        skyboxCube.render();
        gl.disableVertexAttribArray(skyboxParams.a_vertexPositionLocation);
    }

    gl.useProgram(framesParams.prog);
    gl.uniformMatrix4fv(framesParams.u_projectionLocation, false, projection);

    gl.enableVertexAttribArray(framesParams.a_vertexPositionLocation);
    gl.enableVertexAttribArray(framesParams.a_normalLocation);

    for (var i = 0; i < floatingFramesData.length; i++) {
        var saveMB = mat4.clone(modelview);
        var cd = floatingFramesData[i];
        mat4.rotate(modelview, modelview, fNum * cd.globalAngularVelocity, cd.globalRotationAxis);
        mat4.translate(modelview,modelview,cd.translation);
        mat4.rotate(modelview, modelview, fNum * cd.localAngularVelocity, cd.localRotationAxis);
        mat3.normalFromMat4(normalMatrix, modelview);
        frameModel.render();
        modelview = saveMB;
    }

    gl.disableVertexAttribArray(framesParams.a_vertexPositionLocation);
    gl.disableVertexAttribArray(framesParams.a_normalLocation);
}

function drawScene() {

    if (!skyboxCubeMap) {
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return;
    }

    createDynamicCubeMap();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0,0,GC.width,GC.height);

    gl.useProgram(skyboxParams.prog);

    mat4.perspective(projection, Math.PI/4, 1, 1, 100);
    modelview = rotator.getViewMatrix();

    renderSkyboxAndFrames();

    mat3.fromMat4(inverseViewTransform, modelview);
    mat3.invert(inverseViewTransform,inverseViewTransform);

    mat4.rotateX(modelview,modelview,rotX);
    mat4.rotateY(modelview,modelview,rotY);

    mat3.normalFromMat4(normalMatrix, modelview);

    gl.useProgram(shuttleParams.prog);
    mat4.perspective(projection, Math.PI/4, 1, 1, 10);
    gl.uniformMatrix4fv(shuttleParams.u_projectionLocation, false, projection);
    mat3.normalFromMat4(normalMatrix, modelview);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, dynamicCubeMap);
    gl.enableVertexAttribArray(shuttleParams.a_vertexPositionLocation);
    gl.enableVertexAttribArray(shuttleParams.a_normalLocation);
    shuttle.render();
    gl.disableVertexAttribArray(shuttleParams.a_vertexPositionLocation);
    gl.disableVertexAttribArray(shuttleParams.a_normalLocation);
}

demo.prototype.loadTexture = function() {
    var ct = 0;
    var img = new Array(6);
    var urls = envUrl;
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function() {
            ct++;
            if (ct == 6) {
                skyboxCubeMap = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxCubeMap);
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
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    }
                } catch(e) {
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                if (anm) {
                    requestAnimationFrame(frame);
                }
                else {
                    drawScene();
                }
            }
        }
        img[i].onerror = function() {
        }
        img[i].src = urls[i];
    }
}

demo.prototype.createModel = function(modelData, type) {

    var params;
    if(type == 0) params = shuttleParams;
    else params = framesParams;

    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.vertexIndices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.vertexIndices, gl.STATIC_DRAW);
    model.render = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(params.a_vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(params.a_normalLocation, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(params.u_modelviewLocation, false, modelview );
        gl.uniformMatrix3fv(params.u_normalMatrixLocation, false, normalMatrix);
        gl.uniformMatrix3fv(params.u_inverseViewTransformLocation, false, inverseViewTransform);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    };
    return model;
}

demo.prototype.createSkybox = function(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(skyboxParams.a_vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(skyboxParams.u_modelviewLocation, false, modelview );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    };
    return model;
}

demo.prototype.programCreator = function (gl, vertexShaderName, fragmentShaderName) {

    var fragmentShader = this.getShader(fragmentShaderName);
    var vertexShader = this.getShader(vertexShaderName);
    var prog = gl.createProgram();
    gl.attachShader(prog,fragmentShader);
    gl.attachShader(prog, vertexShader);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}

function detectKey(evt) {
    var rotationChanged = true;
    switch (evt.keyCode) {
        case 37: rotY -= 0.15; break;        // left arrow
        case 39: rotY +=  0.15; break;       // right arrow
        case 38: rotX -= 0.15; break;        // up arrow
        case 40: rotX += 0.15; break;        // down arrow
        case 13:                             // return
        case 36:                             // home
            rotX = rotY = 0;
            rotator.setAngles(0,0);
            break;
        default: rotationChanged = false;
    }
    if (rotationChanged) {
        evt.preventDefault();
        drawScene();
    }
}

function frame() {
    if (anm) {
        fNum++;
        drawScene();
        requestAnimationFrame(frame);
    }
}

function buildFrameData() {

    var data =
        "v  -35.4331 0.0000 0.6890\n" +
        "v  -35.4331 0.0000 -0.6890\n" +
        "v  35.4331 0.0000 -0.6890\n" +
        "v  35.4331 0.0000 0.6890\n" +
        "v  35.4331 35.4331 0.6890\n" +
        "v  35.4331 35.4331 -0.6890\n" +
        "v  -35.4331 35.4331 0.6890\n" +
        "v  -35.4331 35.4331 -0.6890\n" +
        "# 8 vertices\n" +
        "\n" +
        "vn 0.0000 -1.0000 0.0000\n" +
        "vn 1.0000 0.0000 -0.0000\n" +
        "vn -1.0000 0.0000 -0.0000\n" +
        "vn 0.0000 -0.0000 -1.0000\n" +
        "vn 0.0000 1.0000 -0.0000\n" +
        "vn 0.0000 0.0000 1.0000\n" +
        "# 6 vertex normals\n" +
        "\n" +
        "vt 0.0000 0.0000 0.0000\n" +
        "vt -4.0133 14.0033 0.0000\n" +
        "vt -4.9984 13.9898 0.0000\n" +
        "vt -4.9950 13.0108 0.0000\n" +
        "vt -4.0099 13.0244 0.0000\n" +
        "# 5 texture coords\n" +
        "\n" +
        "g Layer0_001\n" +
        "usemtl _Charcoal_\n" +
        "s off\n" +
        "f 1/1/1 2/1/1 3/1/1 4/1/1 \n" +
        "f 5/1/2 4/1/2 3/1/2 6/1/2 \n" +
        "f 2/1/3 1/1/3 7/1/3 8/1/3 \n" +
        "f 3/1/4 2/1/4 8/1/4 6/1/4 \n" +
        "f 8/1/5 7/1/5 5/1/5 6/1/5 \n" +
        "usemtl 100_5969\n" +
        "f 1/2/6 4/3/6 5/4/6 7/5/6";

    var mesh = OBJ.Mesh(data);

    return {
        vertexPositions: new Float32Array(mesh.vertices),
        vertexNormals: new Float32Array(mesh.vertexNormals),
        vertexTextureCoords: new Float32Array(mesh.textures),
        vertexIndices: new Uint16Array(mesh.indices)
    }
}

//initialize webgl
demo.prototype.initWebGL = function(){

    gl = null;

    try {
        gl = this.canvas.getContext("experimental-webgl");
    }
    catch(e) {
    }
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    try {
        this.initShaders();  // initialize the WebGL graphics context
    }
    catch (e) {
        return;
    }
    document.addEventListener("keydown", detectKey, false);
    rotator = new Rotator(this.canvas,function() {
        if (!anm)
            drawScene();
    },3);
    createFloatingFramesData();
    this.loadTexture();
}

//compile shader located within a script tag
demo.prototype.getShader = function(id){
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);
    if(!shaderScript){
        return null;
    }

    theSource = "";

    currentChild = shaderScript.firstChild;

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

    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log("error compiling shaders -- " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

demo.prototype.setMouseEventCallbacks = function(){

    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmousewheel = this.mouseWheel;

    document.onmouseup = this.mouseUp;
    document.onmousemove = this.mouseMove;

    this.canvas.ontouchstart = this.touchDown;
    this.canvas.ontouchend = this.touchUp;
    this.canvas.ontouchmove = this.touchMove;
}

demo.prototype.setKeyboardEventCallbacks = function(){
    //--Why set these to callbacks for the document shuttle?
    document.onkeydown = this.keyDown;
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

