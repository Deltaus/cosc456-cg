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
</head>
<body>
<p>
    It's kinda fuzzy using neyland pictures. So I picked another one. Still in low resolution....
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

<p>
Back to <a href="../../index.php">Homepage</a>
</p>

<!-- Fragment Shader -->
<script id="FragmentShader1" type="x-shader/x-fragment">

    precision highp float;

     varying vec3 vCoords;
     varying vec3 v_normal;
     varying vec3 v_eyeCoords;

     uniform samplerCube u_texture;
     uniform mat3 u_nMatrix;
     uniform vec3 u_camPos;

     void main() {
          vec3 N = normalize(u_nMatrix * v_normal);
          vec3 V = v_eyeCoords - u_camPos;
          vec3 R = reflect(V,N);
          //vec3 T = inverseViewTransform * R;
          gl_FragColor = textureCube(u_texture, R);
     }

</script>

<!-- Vertex Shader -->
<script id="VertexShader1" type="x-shader/x-vertex">

     uniform mat4 uPMatrix;
     uniform mat4 uMVMatrix;

     attribute vec3 vPos;
     attribute vec3 a_normal;

     varying vec3 v_eyeCoords;
     varying vec3 v_normal;

     float scale = 1.0;

     void main() {
        vec4 eyeCoords = uMVMatrix * vec4(vPos,scale);
        gl_Position = uPMatrix * eyeCoords;
        v_eyeCoords = eyeCoords.xyz;
        v_normal = normalize(a_normal);
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
