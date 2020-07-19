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
    <script type="text/javascript" src="webgl-obj-loader-gh-pages/webgl-utils.js"></script>
</head>
<body>
<p>
    <br>
    For this project, I was planning a different scenario like what was described in the project proposal. Plan I in the proposal was done before the
    end of April, but when I started to work on plan II I found out that it might require external library like three.js, which I didn't know whether
    it's allowed or not. But without that it just could be much harder.<br>
    And then the TA provided a skybox material in canvas(I also looked for such background pictures for a long time but failed). So I thought it might
    seem better to use skybox(first one didn't) in the project, then I did this one. However, there's a problem with the mesh data of the shuttle. At
    first I used the meshloader in previous tasks. But that one can't handle complex texture mapping, so I shifted to a external plugin to load .obj file.
    But as you can see there are some displacement due to the irregular lines in the obj file. I haven't figured out how to deal with that and then do the
    texture mapping, but it's already May 2nd and it's final week so I just left it there...sorry.<br>

    Requirements:<br>
    1.           No less than 3 object:   1 skybox + 1 shuttle + 50 fragments (52);<br>
    2.           No less than 3 effect:   reflection / skybox / animation;<br>
    3. No less than 3 fragment shaders:   1 for skybox, 1 for shuttle, 1 for cuboids;<br>
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
Back to <a href="../index.php">Homepage</a>
</p>

<!-- SKYBOX -->
<script id="fshader-skybox" type="x-shader/x-fragment">
     precision mediump float;
     varying vec3 v_Pos;
     uniform samplerCube skybox;
     void main() {
          gl_FragColor = textureCube(skybox, v_Pos);
     }
</script>
<script id="vshader-skybox" type="x-shader/x-vertex">
     uniform mat4 uPMatrix;
     uniform mat4 uMVMatrix;
     attribute vec3 a_Pos;
     varying vec3 v_Pos;
     void main() {
        vec4 eyeCoords = uMVMatrix * vec4(a_Pos,1.0);
        gl_Position = uPMatrix * eyeCoords;
        v_Pos = a_Pos;
     }
</script>
<!-- SST -->
<script id="fshader-obj" type="x-shader/x-fragment">
     precision mediump float;

     varying vec3 v_Pos;
     varying vec3 v_Norm;
     varying vec3 v_eyeCoords;

     uniform samplerCube skybox;
     uniform mat3 uNMatrix;
     uniform mat3 uIVTMatrix;

     void main() {
          vec3 N = normalize(uNMatrix * v_Norm);
          vec3 V = -v_eyeCoords;
          vec3 R = -reflect(V,N);
          vec3 T = uIVTMatrix * R;
          gl_FragColor = textureCube(skybox, T);
     }
</script>
<script id="vshader-obj" type="x-shader/x-vertex">
     uniform mat4 uPMatrix;
     uniform mat4 uMVMatrix;
     attribute vec3 a_Pos;
     attribute vec3 a_Norm; //normal

     varying vec3 v_eyeCoords;
     varying vec3 v_Norm;
     float scale = 8.0;
     void main() {
        vec4 eyeCoords = uMVMatrix * vec4(a_Pos,scale);
        gl_Position = uPMatrix * eyeCoords;
        v_eyeCoords = eyeCoords.xyz;
        v_Norm = normalize(a_Norm);
     }
</script>
<!-- AST -->
<script id="fshader-frm" type="x-shader/x-fragment">
    #ifdef GL_FRAGMENT_PRECISION_HIGH
       precision highp float;
    #else
       precision mediump float;
    #endif
    uniform mat3 uNMatrix;
    uniform mat3 uIVTMatrix;
    uniform samplerCube skybox;

    varying vec3 v_Norm;
    varying vec3 v_eyeCoords;

    void main() {
        vec3 N = normalize(uNMatrix * v_Norm);
        vec3 V = -v_eyeCoords;
        vec3 R = -reflect(V,N);
        vec3 T = uIVTMatrix * R;
        gl_FragColor = textureCube(skybox, T);
    }
</script>
<script id="vshader-frm" type="x-shader/x-vertex">
    attribute vec3 a_Pos;
    attribute vec3 a_Norm;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec3 v_Norm;
    varying vec3 v_eyeCoords;
    void main() {
        vec4 eyeCoords = uMVMatrix * vec4(a_Pos,80);
        gl_Position = uPMatrix * eyeCoords;
        v_Norm = normalize(a_Norm);
        v_eyeCoords = eyeCoords.xyz/eyeCoords.w;
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
