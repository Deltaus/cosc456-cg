if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) === str;
  };
}
var modelLoader = {};

modelLoader.Mesh = function( objectData ){
    /*
        With the given elementID or string of the OBJ, this parses the
        OBJ and creates the mesh.
    */

    var verts = [];
    
    // unpacking stuff
    var packed = {};
    packed.indices = [];

    //var norms;
    //vertex and its corresponding faces;
    this.verFaces = new Array();
    var faceCount = 0;
    
    // array of lines separated by the newline
    var lines = objectData.split( '\n' )
    for( var i=0; i<lines.length; i++ ){

       lines[i] = lines[i].replace(/\s{2,}/g, " "); // remove double spaces

      // if this is a vertex
      if( lines[ i ].startsWith( 'v ' ) ){
        line = lines[ i ].slice( 2 ).split( " " )
        verts.push( line[ 0 ] );
        verts.push( line[ 1 ] );
        verts.push( line[ 2 ] );
      }
      // if this is a vertex normal
      else if( lines[ i ].startsWith( 'vn' ) ){
      }
      // if this is a texture
      else if( lines[ i ].startsWith( 'vt' ) ){
      }
      // if this is a face
      else if( lines[ i ].startsWith( 'f ' ) ){

        line = lines[ i ].slice( 2 ).split( " " );
        for(var j=1; j <= line.length-2; j++){
            var i1 = line[0].split('/')[0] - 1;
            var i2 = line[j].split('/')[0] - 1;
            var i3 = line[j+1].split('/')[0] - 1;
            packed.indices.push(i1,i2,i3);

            //console.log("OUT");
            if(i1 in this.verFaces) {
                this.verFaces[i1].push(faceCount)
            }
            else {
                this.verFaces[i1] = [faceCount];
                //console.log("IN");
            }

            if(i2 in this.verFaces) {
                this.verFaces[i2].push(faceCount)
            }
            else {
                this.verFaces[i2] = [faceCount];
            }

            if(i3 in this.verFaces) {
                this.verFaces[i3].push(faceCount)
            }
            else {
                this.verFaces[i3] = [faceCount];
            }
        }
        faceCount++;
      }
    }
    this.vertices = verts;
    this.indices = packed.indices;

    //this.verFaces = verFaces;
    this.normals = computeNorms(this.vertices, this.indices, this.verFaces);
}
