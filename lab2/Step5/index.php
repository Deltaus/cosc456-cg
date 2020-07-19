<? php ?>
<html>
<head>
<meta charset="utf-8">
<title>Model Viewer</title>
<!-- include all javascript source files -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/sylvester.js"></script>
    <script type="text/javascript" src="js/math.js"></script>
    <script type="text/javascript" src="js/glUtils.js"></script>
    <script type="text/javascript" src="js/meshLoader.js"></script>
    <script type="text/javascript" src="js/arcball.js"></script>
    <script type="text/javascript" src="js/demo.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/sizeof.js"></script>
    <script type="text/javascript" src="../toji-gl-matrix/dist/gl-matrix.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <script type="text/javascript" src="js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/matrix.js"></script>
    <link href="css/slider.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css" />
</head>
<body>
<canvas id="glcanvas">canvas not supported</canvas>

<div id="meshSelect-wrapper">
    <span>Select object from this directory (.obj files only)</span>
    <select id="meshSelect">
    <?php //----- php code to create html selection with local files

        $files = glob("*.obj"); //find all .obj files in current directory
        $beginFile = "";
        foreach ($files as $filename) {
            if($filename == end($files)){
                $beginFile = $filename;
                echo "<option selected=\"selected\">$filename</option>";
            } else {
                echo "<option>$filename</option>";
            }
        }
    ?>
    </select>
    <br />
    <span>Or upload a local file here:</span>
    <input type="file" id="files" name="files[]"/>
</div>

<!-- Sliders for lighting parameters -->
<table>
    Parameters:
    <tr>
        <td align='right'>Ambient Reflection (ka):</td>
        <td><div class="slider" id="kar"></div></td>
        <td id='kav' width='30px'>1.0 </td>
    </tr>
    <tr>
        <td align='right'>Diffuse Reflection (kd):</td>
        <td><div class="slider" id="kdr"></div></td>
        <td id='kdv' width='30px'>1.0 </td>
    </tr>
    <tr>
        <td align='right'>Specular Reflection (ks):</td>
        <td><div class="slider" id="ksr"></div></td>
        <td id='ksv' width='30px'>0.5 </td>
    </tr>
    <tr>
        <td align='right'>Shininess:</td>
        <td width='150px'><div class="slider" id="shr"></div></td>
        <td id='shv' width='30px'>10</td>
    </tr>
</table>
<!-- Sliders for lighting positions -->
<table>
    Light Source Position:
    <tr>
        <td align='right'>x:</td>
        <td width="150px"><div class="slider" id="xr"></div></td>
        <td id='xv' width='30px'>0.0 </td>
    </tr>
    <tr>
        <td align='right'>y:</td>
        <td><div class="slider" id="yr"></div></td>
        <td id='yv' width='30px'>0.0 </td>
    </tr>
    <tr>
        <td align='right'>z:</td>
        <td><div class="slider" id="zr"></div></td>
        <td id='zv' width='30px'>0.0 </td>
    </tr>
</table>

<p>
    Back to <a href="../../index.php">Homepage</a>
</p>

<!-- Update value of param sliders -->
<script>
    $(function() {
    $('#kar').slider({value:1, max:1, step:0.01, range:"min", slide:updateLightAmbientTerm});
    $("#kdr").slider({value:1, max:1, step:0.01, range:"min", slide:updateLightDiffuseTerm});
    $('#ksr').slider({value:0.5, max:1, step:0.01, range:"min", slide:updateLightSpecularTerm});
    $("#shr").slider({value:10, max:10, min:0.1, step:0.05, range:"min", slide:updateShininess});
    })

    function updateLightAmbientTerm(event, ui){
        $('#kav').html(ui.value);
        GC.kaVal = ui.value;
        drawScene()
    }
    function updateLightDiffuseTerm(event, ui){
        $('#kdv').html(ui.value);
        GC.kdVal = ui.value;
        drawScene()
    }
    function updateLightSpecularTerm(event, ui){
        $('#ksv').html(ui.value);
        GC.ksVal = ui.value;
        drawScene();
    }
    function updateShininess(event, ui){
        $('#shv').html(ui.value);
        GC.shVal = ui.value;
        drawScene();
    }
</script>
<!-- Update position sliders-->
<script>
    $(function () {
        $('#xr').slider({value:0, max:40, min:-40, step:0.01, range:"min", slide:updatePosX});
        $("#yr").slider({value:0, max:40, min:-40, step:0.01, range:"min", slide:updatePosY});
        $('#zr').slider({value:0, max:40, min:-40, step:0.01, range:"min", slide:updatePosZ});
    })

    function updatePosX(event, ui) {
        $('#xv').html(ui.value);
        GC.lsX = ui.value;
        drawScene();
    }
    function updatePosY(event, ui) {
        $('#yv').html(ui.value);
        GC.lsY = ui.value;
        drawScene();
    }
    function updatePosZ(event, ui) {
        $('#zv').html(ui.value);
        GC.lsZ = ui.value;
        drawScene();
    }
</script>

<!-- Fragment Shader -->
<!-- Normal Color -->
<script id="FragmentShader1" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision mediump float;
    varying vec4 lighting;

    void main(void){
        gl_FragColor = lighting;
    }

</script>
<!-- Gouraud shading -->
<script id="FragmentShader2" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision mediump float;
    varying vec4 lighting;

    void main(void){
        gl_FragColor = lighting;
    }
</script>
<!-- Phong shading -->
<script id="FragmentShader3" type="x-shader/x-fragment">

    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision mediump float;

    varying vec3 vertexPos3;
    varying vec3 normalIntp;
    varying vec3 glPos;
    varying vec3 glPos_maxY;
    varying vec3 glPos_minY;

    uniform float ka;
    uniform float kd;
    uniform float ks;
    uniform float sh;
    uniform vec3 ambientColor;
    uniform vec3 diffuseColor;
    uniform vec3 specularColor;
    uniform vec3 lightPosition;

    void main(void) {

        float ratio = (glPos[1] - glPos_minY[1]) / (glPos_maxY[1] - glPos_minY[1]);
        vec3 ambientColor_r = vec3(ratio, ambientColor[1], ambientColor[2]);
        vec3 diffuseColor_r = vec3(ratio, diffuseColor[1], diffuseColor[2]);

        vec3 N = normalize(normalIntp);
        vec3 L = normalize(lightPosition - vertexPos3);

        float lamb = max(dot(N, L), 0.0);
        float spec = 0.0;

        if(lamb > 0.0) {
            vec3 R = reflect(-L, N);
            vec3 V = normalize(-vertexPos3);
            float specAngle = max(dot(R, V), 0.0);
            spec = pow(specAngle, sh);
        }

        //vec3 vNorm_abs = vec3(abs(vNorm[0]), abs(vNorm[1]), abs(vNorm[2]))
        gl_FragColor = vec4(ka * ambientColor_r + kd * lamb * diffuseColor_r + ks * spec * specularColor, 1.0);
    }
</script>

<!-- Vertex Shader -->
<!-- Normal Color -->
<script id="VertexShader1" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 vNorm;

    varying vec4 lighting;

    uniform mat4 uMVMatrix; //modelviewmatrix
    uniform mat4 uPMatrix;  //projectionmatrix
    uniform mat4 uNMatrixl; //normalmatrix

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
        //light:
        lighting = vec4(vNorm, 1.0) * 0.5 + 0.5;
    }
</script>
<!-- Gouraud shading" -->
<script id="VertexShader2" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 vNorm;

    varying vec4 lighting;
    varying vec3 normalIntp;

    uniform mat4 uMVMatrix; //modelviewmatrix
    uniform mat4 uPMatrix;  //projectionmatrix
    uniform mat4 uNMatrix; //normalmatrix

    uniform float ka;
    uniform float kd;
    uniform float ks;
    uniform float sh;
    uniform vec3 ambientColor;
    uniform vec3 diffuseColor;
    uniform vec3 specularColor;
    uniform vec3 lightPosition;

    void main(void) {

        vec4 vertexPos4 = uMVMatrix * vec4(vPos, 1.0);
        vec3 vertexPos3 = vec3(vertexPos4) / vertexPos4.w;
        gl_Position = uPMatrix * vertexPos4;

        normalIntp = vec3(uNMatrix * vec4(vNorm, 0.0));

        vec3 N = normalize(normalIntp);
        vec3 L = normalize(lightPosition - vertexPos3);

        float lamb = max(dot(N, L), 0.0);
        float spec = 0.0;

        if(lamb > 0.0) {
            vec3 R = reflect(-L, N);
            vec3 V = normalize(-vertexPos3);
            float specAngle = max(dot(R, V), 0.0);
            spec = pow(specAngle, sh);
        }

        //vec3 vNorm_abs = vec3(abs(vNorm[0]), abs(vNorm[1]), abs(vNorm[2]))
        lighting = vec4(ka * abs(vNorm) + kd * lamb * diffuseColor + ks * spec * specularColor, 1.0);
    }
</script>
<!-- Phong Shading -->
<script id="VertexShader3" type="x-shader/x-vertex">
    attribute vec3 vPos; //vertex position
    attribute vec3 vNorm;

    varying vec3 normalIntp;
    varying vec3 vertexPos3;
    varying vec3 glPos;
    varying vec3 glPos_maxY;
    varying vec3 glPos_minY;

    uniform mat4 uMVMatrix; //modelviewmatrix
    uniform mat4 uPMatrix;  //projectionmatrix
    uniform mat4 uNMatrix; //normalmatrix
    uniform vec3 maxYPos;
    uniform vec3 minYPos;

    void main(void) {

        //regular vert
        vec4 vertexPos4 = uMVMatrix * vec4(vPos, 1.0);
        vertexPos3 = vec3(vertexPos4) / vertexPos4.w;
        gl_Position = uPMatrix * vertexPos4;

        //max y calculation
        vec4 maxYPos4 = uMVMatrix * vec4(maxYPos, 1.0);
        glPos_maxY = vec3(uPMatrix * maxYPos4);

        //min y calculation
        vec4 minYPos4 = uMVMatrix * vec4(minYPos, 1.0);
        glPos_minY = vec3(uPMatrix * minYPos4);

        glPos = vec3(gl_Position);

        normalIntp = vec3(uNMatrix * vec4(vNorm, 0.0));
    }
</script>



<script>
    //grab the filename for the .obj we will first open
    var filename = "<? echo $beginFile ?>";

    //register callbacks for mesh loading
    setupLoadingCallbacks();

    //call the main mesh Loading function; main.js
    executeMainLoop(filename); 
</script>

</body>
</html>
