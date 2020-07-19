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
<script type="text/javascript" src="toji-gl-matrix/dist/gl-matrix.js"></script>>
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

<p>
Back to <a href="../../index.php">Homepage</a>
</p>


<!-- Fragment Shader -->
<script id="FragmentShader1" type="x-shader/x-fragment">
    #ifdef GL_OES_standard_derivatives
        #extension GL_OES_standard_derivatives : enable
    #endif

    precision mediump float;
    varying vec4 lighting;

    void main(void){
        //change this from true to false and compare the differences
        bool antiAliasing = true;
        vec4 blue = vec4(0.0,0.5,1.0,1.0);
        vec4 white = vec4(1.0,1.0,1.0,1.0);

        //  Advanced version
        //shader which draws anti-aliased edge lines on the mesh
        //uses fwidth and passed in barycentric coordinates
        if(antiAliasing){
            gl_FragColor = lighting;
        } 
        //  Simple Version
        //This checks if the fragments are near the edge and colors blue if true
        //      and white if false
        //This shader exhibits aliasing which is why the edge lines appear jagged
        else {
            /*
            if(any(lessThan(interpBary,vec3(0.01)))){
                gl_FragColor = blue;
            }
            else {
                gl_FragColor = white;
            }
            */
        }
    }

</script>

<!-- Vertex Shader -->
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
        lighting = vec4(abs(vNorm), 1.0) * 0.5 + 0.5;
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
