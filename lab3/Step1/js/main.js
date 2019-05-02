function executeMainLoop(){
    //jQuery ajax call to load the .obj file from the local directory
    //create a new model viewing demo
    var myDemo = new demo("glcanvas");

    //setup the webgl context and initialize everything
    myDemo.init();

    //enter the event driven loop; ---- demo.js
    myDemo.MainLoop();
}
