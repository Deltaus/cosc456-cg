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

<p>
    Move the cube to see the effect.
</p>
<p>
Back to <a href="../../index.php">Homepage</a>
</p>


<!-- Fragment Shader -->
<script id="FragmentShader1" type="x-shader/x-fragment">

    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }

</script>

<!-- Vertex Shader -->
<script id="VertexShader1" type="x-shader/x-vertex">

    attribute vec3 vPos;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix; //modelviewmatrix
    uniform mat4 uPMatrix;  //projectionmatrix

    varying highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);
        vTextureCoord = aTextureCoord;
    }
</script>

<script>
    executeMainLoop();
</script>

</body>
</html>
