//------- utility functions

//Pass the ModelView Matrix and the Projection matrix to the opengl shaders
function setMatrixUniforms(gContext) {
    var pUniform = gl.getUniformLocation(gContext.shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(gContext.perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(gContext.shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(gContext.mvMatrix.flatten()));

    gContext.uSamp = gl.getUniformLocation(gContext.shaderProgram, "u_texture");
}

//
// similar to glLoadIdentity, only affects modelViewMatrix
//
function mvLoadIdentity(gContext) {
    gContext.mvMatrix = Matrix.I(4);
}

//
// similar to glMultMatrix, only affects modelViewMatrix
//
function mvMultMatrix(m,gContext) {
    gContext.mvMatrix = gContext.mvMatrix.x(m);
}

//
// similar to glTransform, only affects modelViewMatrix
//
function mvTranslate(v,gContext) {
    mvMultMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4(),gContext);
}


//
// similar to glPushMatrix, only affects modelViewMatrix stack
//
function mvPushMatrix(m,gContext) {
  if (m) {
    gContext.mvMatrixStack.push(m.dup());
    gContext.mvMatrix = m.dup();
  } else {
    gContext.mvMatrixStack.push(gContext.mvMatrix.dup());
  }
}

//
// similar to glPopMatrix, only affects modelViewMatrix stack
//
function mvPopMatrix(gContext) {
  if (!gContext.mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  
  gContext.mvMatrix = gContext.mvMatrixStack.pop();
  return gContext.mvMatrix;
}

//
// similar to glRotate, only affects modelViewMatrix
//
function mvRotate(angle, v, gContext) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  mvMultMatrix(m,gContext);
}




//
// gluLookAt
//
function makeLookAt(ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz)
{
    var eye = $V([ex, ey, ez]);
    var center = $V([cx, cy, cz]);
    var up = $V([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]]);

    var t = $M([[1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]]);
    return m.x(t);
}

//
// glOrtho
//
function makeOrtho(left, right,
                   bottom, top,
                   znear, zfar)
{
    var tx = -(right+left)/(right-left);
    var ty = -(top+bottom)/(top-bottom);
    var tz = -(zfar+znear)/(zfar-znear);

    return $M([[2/(right-left), 0, 0, tx],
               [0, 2/(top-bottom), 0, ty],
               [0, 0, -2/(zfar-znear), tz],
               [0, 0, 0, 1]]);
}

//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar)
{
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//
// glFrustum
//
function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return $M([[X, 0, A, 0],
               [0, Y, B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]]);
}

//
// glOrtho
//
function makeOrtho(left, right, bottom, top, znear, zfar)
{
    var tx = - (right + left) / (right - left);
    var ty = - (top + bottom) / (top - bottom);
    var tz = - (zfar + znear) / (zfar - znear);

    return $M([[2 / (right - left), 0, 0, tx],
           [0, 2 / (top - bottom), 0, ty],
           [0, 0, -2 / (zfar - znear), tz],
           [0, 0, 0, 1]]);
}


function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m
}

function accSub(arg1,arg2){
    return accAdd(arg1,-arg2);
}


function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}


function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*pow(10,t2-t1);
    }
}

function computeNorms(verts, packed, vFaces) {

    var i;
    var normsFaces = [];
    var normsVert = [];

    for(i = 0; i < (packed.length / 3); i++) {
        var v1_x = verts[packed[i * 3 + 1] * 3 + 0];
        var v1_y = verts[packed[i * 3 + 1] * 3 + 1];
        var v1_z = verts[packed[i * 3 + 1] * 3 + 2];
        var v2_x = verts[packed[i * 3 + 2] * 3 + 0];
        var v2_y = verts[packed[i * 3 + 2] * 3 + 1];
        var v2_z = verts[packed[i * 3 + 2] * 3 + 2];
        var v0_x = verts[packed[i * 3 + 0] * 3 + 0];
        var v0_y = verts[packed[i * 3 + 0] * 3 + 1];
        var v0_z = verts[packed[i * 3 + 0] * 3 + 2];

        var u1 = accSub(v1_x, v0_x);
        var u2 = accSub(v1_y, v0_y);
        var u3 = accSub(v1_z, v0_z);
        var v1 = accSub(v2_x, v0_x);
        var v2 = accSub(v2_y, v0_y);
        var v3 = accSub(v2_z, v0_z);

        var x = accSub(accMul(u2, v3), accMul(u3, v2));
        var y = accSub(accMul(u3, v1), accMul(u1, v3));
        var z = accSub(accMul(u1, v2), accMul(u2, v1));

        normsFaces.push(accDiv(x, Math.sqrt(accMul(x, x) + accMul(y, y) + accMul(z, z))));
        normsFaces.push(accDiv(y, Math.sqrt(accMul(x, x) + accMul(y, y) + accMul(z, z))));
        normsFaces.push(accDiv(z, Math.sqrt(accMul(x, x) + accMul(y, y) + accMul(z, z))));
    }

    for(i = 0; i < (verts.length / 3); i++) {

        var num = vFaces[i].length;
        var fs = [];
        var k;
        for(k = 0; k < num; k++) {
            fs.push(vFaces[i][k]);
        }

        var fs_x = [];
        var fs_y = [];
        var fs_z = [];

        for(k = 0; k < num; k++) {
            fs_x.push(normsFaces[fs[k] * 3 + 0]);
            fs_y.push(normsFaces[fs[k] * 3 + 1]);
            fs_z.push(normsFaces[fs[k] * 3 + 2]);
        }

        var sum_x = 0;
        var sum_y = 0;
        var sum_z = 0;

        for(k = 0; k < num; k++) {
            sum_x = accAdd(sum_x, fs_x[k]);
            sum_y = accAdd(sum_y, fs_y[k]);
            sum_z = accAdd(sum_z, fs_z[k]);
        }

        var v_x = accDiv(sum_x, num);
        var v_y = accDiv(sum_y, num);
        var v_z = accDiv(sum_z, num);

        var md = Math.sqrt(accAdd(accAdd(accMul(v_x, v_x), accMul(v_y, v_y)), accMul(v_z, v_z)));

        normsVert.push(accDiv(v_x, md));
        normsVert.push(accDiv(v_y, md));
        normsVert.push(accDiv(v_z, md));
    }

    return normsVert;
}

function Rotator(canvas, callback, viewDistance, rotY, rotX) {

    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("touchstart", doTouchStart, false);

    var rotateX = (rotX === undefined)? 0 : rotX;
    var rotateY = (rotY === undefined)? 0 : rotY;
    var xLimit = 85;
    var center;
    var degreesPerPixelX = 90/canvas.height;
    var degreesPerPixelY = 180/canvas.width;
    this.getXLimit = function() {
        return xLimit;
    }
    this.setXLimit = function(limitInDegrees) {
        xLimit = Math.min(85,Math.max(0,limitInDegrees));
    }
    this.getRotationCenter = function() {
        return (center === undefined) ? [0,0,0] : center;
    }
    this.setRotationCenter = function(rotationCenter) {
        center = rotationCenter;
    }
    this.setAngles = function( rotY, rotX ) {
        rotateX = Math.max(-xLimit, Math.min(xLimit,rotX));
        rotateY = rotY;
        if (callback) {
            callback();
        }
    }
    this.setViewDistance = function( dist ) {
        viewDistance = dist;
    }
    this.getViewDistance = function() {
        return (viewDistance === undefined)? 0 : viewDistance;
    }
    this.getViewMatrix = function() {
        var cosX = Math.cos(rotateX/180*Math.PI);
        var sinX = Math.sin(rotateX/180*Math.PI);
        var cosY = Math.cos(rotateY/180*Math.PI);
        var sinY = Math.sin(rotateY/180*Math.PI);
        var mat = [  // The product of rotation by rotationX about x-axis and by rotationY about y-axis.
            cosY, sinX*sinY, -cosX*sinY, 0,
            0, cosX, sinX, 0,
            sinY, -sinX*cosY, cosX*cosY, 0,
            0, 0, 0, 1
        ];
        if (center !== undefined) {  // multiply on left by translation by rotationCenter, on right by translation by -rotationCenter
            var t0 = center[0] - mat[0]*center[0] - mat[4]*center[1] - mat[8]*center[2];
            var t1 = center[1] - mat[1]*center[0] - mat[5]*center[1] - mat[9]*center[2];
            var t2 = center[2] - mat[2]*center[0] - mat[6]*center[1] - mat[10]*center[2];
            mat[12] = t0;
            mat[13] = t1;
            mat[14] = t2;
        }
        if (viewDistance !== undefined) {  // multipy on left by translation by (0,0,-viewDistance)
            mat[14] -= viewDistance;
        }
        return mat;
    }
    var prevX, prevY;  // previous position, while dragging
    var dragging = false;
    var touchStarted = false;
    function doMouseDown(evt) {
        if (dragging) {
            return;
        }
        dragging = true;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var r = canvas.getBoundingClientRect();
        prevX = evt.clientX - r.left;
        prevY = evt.clientY - r.top;
    }
    function doMouseDrag(evt) {
        if (!dragging) {
            return;
        }
        var r = canvas.getBoundingClientRect();
        var x = evt.clientX - r.left;
        var y = evt.clientY - r.top;
        var newRotX = rotateX + degreesPerPixelX * (y - prevY);
        var newRotY = rotateY + degreesPerPixelY * (x - prevX);
        newRotX = Math.max(-xLimit, Math.min(xLimit,newRotX));
        prevX = x;
        prevY = y;
        if (newRotX != rotateX || newRotY != rotateY) {
            rotateX = newRotX;
            rotateY = newRotY;
            if (callback) {
                callback();
            }
        }
    }
    function doMouseUp(evt) {
        if (!dragging) {
            return;
        }
        dragging = false;
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
    }
    function doTouchStart(evt) {
        if (evt.touches.length != 1) {
            doTouchCancel();
            return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        prevX = evt.touches[0].clientX - r.left;
        prevY = evt.touches[0].clientY - r.top;
        canvas.addEventListener("touchmove", doTouchMove, false);
        canvas.addEventListener("touchend", doTouchEnd, false);
        canvas.addEventListener("touchcancel", doTouchCancel, false);
        touchStarted = true;
    }
    function doTouchMove(evt) {
        if (evt.touches.length != 1 || !touchStarted) {
            doTouchCancel();
            return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.touches[0].clientX - r.left;
        var y = evt.touches[0].clientY - r.top;
        var newRotX = rotateX + degreesPerPixelX * (y - prevY);
        var newRotY = rotateY + degreesPerPixelY * (x - prevX);
        newRotX = Math.max(-xLimit, Math.min(xLimit,newRotX));
        prevX = x;
        prevY = y;
        if (newRotX != rotateX || newRotY != rotateY) {
            rotateX = newRotX;
            rotateY = newRotY;
            if (callback) {
                callback();
            }
        }
    }
    function doTouchEnd(evt) {
        doTouchCancel();
    }
    function doTouchCancel() {
        if (touchStarted) {
            touchStarted = false;
            canvas.removeEventListener("touchmove", doTouchMove, false);
            canvas.removeEventListener("touchend", doTouchEnd, false);
            canvas.removeEventListener("touchcancel", doTouchCancel, false);
        }
    }
}

function cube(side) {
    var s = (side || 1)/2;
    var coords = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    function face(xyz, nrm) {
        var start = coords.length/3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0],nrm[1],nrm[2]);
        }
        texCoords.push(0,0,1,0,1,1,0,1);
        indices.push(start,start+1,start+2,start,start+2,start+3);
    }
    face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
    face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
    face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
    face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
    face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
    face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );
    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}