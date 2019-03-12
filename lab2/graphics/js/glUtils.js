//------- utility functions

//Pass the ModelView Matrix and the Projection matrix to the opengl shaders
function setMatrixUniforms(gContext) {
    var pUniform = gl.getUniformLocation(gContext.shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(gContext.perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(gContext.shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(gContext.mvMatrix.flatten()));
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
        var f0 = vFaces[i][0];
        var f1 = vFaces[i][1];
        var f2 = vFaces[i][2];

        var f0_x = normsFaces[f0 * 3 + 0];
        var f0_y = normsFaces[f0 * 3 + 1];
        var f0_z = normsFaces[f0 * 3 + 2];
        var f1_x = normsFaces[f1 * 3 + 0];
        var f1_y = normsFaces[f1 * 3 + 1];
        var f1_z = normsFaces[f1 * 3 + 2];
        var f2_x = normsFaces[f2 * 3 + 0];
        var f2_y = normsFaces[f2 * 3 + 1];
        var f2_z = normsFaces[f2 * 3 + 2];

        var v_x = accDiv((f0_x + f1_x + f2_x), 3.0);
        var v_y = accDiv((f0_y + f1_y + f2_y), 3.0);
        var v_z = accDiv((f0_z + f1_z + f2_z), 3.0);

        var md = Math.sqrt(accAdd(accAdd(accMul(v_x, v_x), accMul(v_y, v_y)), accMul(v_z, v_z)));

        normsVert.push(accDiv(v_x, md));
        normsVert.push(accDiv(v_y, md));
        normsVert.push(accDiv(v_z, md));
    }

    return normsVert;
}
