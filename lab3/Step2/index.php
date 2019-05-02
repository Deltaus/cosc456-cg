<? php ?>
<html>
<head>
<meta charset="utf-8">
<title>Model Viewer</title>
<!-- include all javascript source files -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <!--<script type="text/javascript" src="toji-gl-matrix/dist/gl-matrix.js"></script>-->
    <script type="text/javascript" src="toji-gl-matrix/gl-matrix-min.js"></script>
    <script type="text/javascript" src="js/sylvester.js"></script>
    <script type="text/javascript" src="js/math.js"></script>
    <script type="text/javascript" src="js/glUtils.js"></script>
    <script type="text/javascript" src="js/meshLoader.js"></script>
    <script type="text/javascript" src="js/arcball.js"></script>
    <script type="text/javascript" src="js/demo.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/sizeof.js"></script>
    <script type="text/javascript" src="webgl-obj-loader-gh-pages/webgl-obj-loader.js"></script>
    <!--<script type="text/javascript" src="webgl-obj-loader-gh-pages/webgl.js"></script>-->
    <script type="text/javascript" src="webgl-obj-loader-gh-pages/webgl-utils.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <script type="text/javascript" src="js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/matrix.js"></script>
    <link href="css/slider.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="css/jquery-ui.min.css" rel="stylesheet" type="text/css" />
</head>
<body>
<p>
    I replaced diffuse light with texture in this task. (I saw the requirement asking to do this in step 3 after I had done this...)
</p>
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


<table>
    Parameters:
    <tr>
        <td align='right'>Ambient Reflection (ka):</td>
        <td><div class="slider" id="kar"></div></td>
        <td id='kav' width='30px'>1.0 </td>
    </tr>
    <tr>
        <td align='right'>Specular Reflection (ks):</td>
        <td><div class="slider" id="ksr"></div></td>
        <td id='ksv' width='30px'>1.0 </td>
    </tr>
    <tr>
        <td align='right'>Shininess:</td>
        <td width='150px'><div class="slider" id="shr"></div></td>
        <td id='shv' width='30px'>5</td>
    </tr>
</table>

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
    Back to <a href="../../index.html">Homepage</a>
</p>

<!-- Update value by slider -->
<script>
    $(function() {
        $('#kar').slider({value:1, max:1, step:0.01, range:"min", slide:updateLightAmbientTerm});
        $('#ksr').slider({value:1, max:1, step:0.01, range:"min", slide:updateLightSpecularTerm});
        $("#shr").slider({value:5, max:10, min:0.1, step:0.05, range:"min", slide:updateShininess});
    })

    function updateLightAmbientTerm(event, ui){
        $('#kav').html(ui.value);
        GC.kaVal = ui.value;
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
<!-- Update Light Source Position-->
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
<script id="FragmentShader1" type="x-shader/x-fragment">

     precision highp float;

     uniform sampler2D u_texture;

     varying vec4 lighting;
     varying float v_kd;
     varying float v_lamb;
     varying vec3 v_textCoords;


     void main() {

          vec4 diffuseColor = texture2D(u_texture, vec2(v_textCoords.s, v_textCoords.t));
          gl_FragColor = lighting + v_kd * v_lamb * diffuseColor;
          //gl_FragColor = lighting;
     }

</script>

<!-- Vertex Shader -->
<script id="VertexShader1" type="x-shader/x-vertex">

     uniform mat4 uPMatrix;
     uniform mat4 uMVMatrix;
     uniform mat4 uNMatrix;

     attribute vec3 vPos;
     attribute vec3 a_textCoords;

     varying vec3 v_textCoords;

     float scale = 1.0;

     attribute vec3 vNorm;

     varying vec4 lighting;
     varying float v_kd;
     varying float v_lamb;

     uniform float ka;
     uniform float kd;
     uniform float ks;
     uniform float sh;
     uniform vec3 ambientColor;

     uniform vec3 specularColor;
     uniform vec3 lightPosition;


     void main() {
        v_textCoords = a_textCoords;

        vec4 vertexPos4 = uMVMatrix * vec4(vPos, 1.0);
        vec3 vertexPos3 = vec3(vertexPos4) / vertexPos4.w;
        gl_Position = uPMatrix * vertexPos4;

        vec3 normalIntp = vec3(uNMatrix * vec4(vNorm, 0.0));

        vec3 N = normalize(normalIntp);
        vec3 L = normalize(lightPosition - vertexPos3);

        float lamb = max(dot(N, L), 0.0);
        float spec = 0.0;

        v_lamb = lamb;
        v_kd = kd;

        if(lamb > 0.0) {
            vec3 R = reflect(-L, N);
            vec3 V = normalize(-vertexPos3);
            float specAngle = max(dot(R, V), 0.0);
            spec = pow(specAngle, sh);
        }

        lighting = vec4(ka * ambientColor + ks * spec * specularColor, 1.0);
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
