//------- utility functions

//Pass the ModelView Matrix and the Projection matrix to the opengl shaders
function setMatrixUniforms(gContext) {
    var pUniform = gl.getUniformLocation(gContext.shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(gContext.perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(gContext.shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(gContext.mvMatrix.flatten()));

    var nUniform = gl.getUniformLocation(gContext.shaderProgram, "uNMatrix");
    if(gContext.nMatrix != null) gl.uniformMatrix4fv(nUniform, false, GC.nMatrix);
}

function getVariableLocations(gContext, mode, sp) {

    if(mode == 0) {
        //attribute location
        gContext.vertexPositionAttribute = gl.getAttribLocation(sp, "vPos");
        gContext.vertexNormalAttribute = gl.getAttribLocation(sp, "vNorm");
    }
    else if(mode == 1 || mode == 2) {
        //attribute location
        gContext.vertexPositionAttribute = gl.getAttribLocation(sp, "vPos");
        gContext.vertexNormalAttribute = gl.getAttribLocation(sp, "vNorm");

        //uniform location
        gContext.kaLocation = gl.getUniformLocation(sp, "ka");
        gContext.kdLocation = gl.getUniformLocation(sp, "kd");
        gContext.ksLocation = gl.getUniformLocation(sp, "ks");
        gContext.shLocation = gl.getUniformLocation(sp, "sh");
        gContext.ambientColorLocation = gl.getUniformLocation(sp, "ambientColor");
        gContext.diffuseColorLocation = gl.getUniformLocation(sp, "diffuseColor");
        gContext.specularColorLocation = gl.getUniformLocation(sp, "specularColor");
        gContext.lightPositionLocation = gl.getUniformLocation(sp, "lightPosition");
    }
    else if(mode == 3) {

    }
}

function setVariableUniforms(gContext) {

    if(gContext.kaLocation != null) gl.uniform1f(gContext.kaLocation, gContext.kaVal);
    if(gContext.kdLocation != null) gl.uniform1f(gContext.kdLocation, gContext.kdVal);
    if(gContext.ksLocation != null) gl.uniform1f(gContext.ksLocation, gContext.ksVal);
    if(gContext.shLocation != null) gl.uniform1f(gContext.shLocation, gContext.shVal);
    if(gContext.ambientColorLocation != null) gl.uniform3fv(gContext.ambientColorLocation, gContext.ambientColor);
    if(gContext.specularColorLocation != null) gl.uniform3fv(gContext.specularColorLocation, gContext.specularColor);
    if(gContext.lightPositionLocation != null) gl.uniform3fv(gContext.lightPositionLocation, gContext.lightPosition);
    if(gContext.diffuseColorLocation != null) gl.uniform3fv(gContext.diffuseColorLocation, gContext.diffuseColor);

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


function vec3Cross(a, b, res) {
    res[0] = a[1] * b[2]  -  b[1] * a[2];
    res[1] = a[2] * b[0]  -  b[2] * a[0];
    res[2] = a[0] * b[1]  -  b[0] * a[1];
}

function vec3Normalize(a) {
    var mag = Math.sqrt(a[0] * a[0]  +  a[1] * a[1]  +  a[2] * a[2]);
    a[0] /= mag; a[1] /= mag; a[2] /= mag;
}

function vec3Dot(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function mat4LookAt(viewMatrix,
                     eyeX, eyeY, eyeZ,
                     centerX, centerY, centerZ,
                     upX, upY, upZ) {

    var dir = new Float32Array(3);
    var right = new Float32Array(3);
    var up = new Float32Array(3);
    var eye = new Float32Array(3);

    up[0]=upX; up[1]=upY; up[2]=upZ;
    eye[0]=eyeX; eye[1]=eyeY; eye[2]=eyeZ;

    dir[0]=centerX-eyeX; dir[1]=centerY-eyeY; dir[2]=centerZ-eyeZ;
    vec3Normalize(dir);
    vec3Cross(dir,up,right);
    vec3Normalize(right);
    vec3Cross(right,dir,up);
    vec3Normalize(up);
    // first row
    viewMatrix[0]  = right[0];
    viewMatrix[4]  = right[1];
    viewMatrix[8]  = right[2];
    viewMatrix[12] = -vec3Dot(right, eye);
    // second row
    viewMatrix[1]  = up[0];
    viewMatrix[5]  = up[1];
    viewMatrix[9]  = up[2];
    viewMatrix[13] = -vec3Dot(up, eye);
    // third row
    viewMatrix[2]  = -dir[0];
    viewMatrix[6]  = -dir[1];
    viewMatrix[10] = -dir[2];
    viewMatrix[14] =  vec3Dot(dir, eye);
    // forth row
    viewMatrix[3]  = 0.0;
    viewMatrix[7]  = 0.0;
    viewMatrix[11] = 0.0;
    viewMatrix[15] = 1.0;
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

function normalize(normVec, dim) {

    var normalized;
    var i;
    var sum = 0.0;
    for(i = 0; i < dim; i++) {
        sum = accAdd(accMul(normVec[i], normVec[i]), sum);
    }

    normalized = accDiv(normVec, Math.sqrt(sum));

    return normalized;
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
