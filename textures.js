

var canvas;
var gl;

var numVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0.0, 0.0),
    vec2(0.0, 1.0),
    vec2(1.0, 1.0),
    vec2(1.0, 0.0)
];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var camera = {
    x : 0,
    y : 0,
    z : -5,
    fovx : 45,
    near : 0.1, 
    far : 30,
    aspect : undefined
}

var theta = [45.0, 45.0];
var axes = [[0, 1, 0], [1, 0, 0]];
var transforms = [
    translate(1, 0, 0),
    translate(-1, 0, 0)
    ];
var rot = true;
var scroll = false;
var texSpin = false;
var offset = [0.5, 0.5];
var imageTheta = 0.0;
var projectionLoc, modelViewLoc, offsetLoc, imageThetaLoc, scaleLoc;


function configureTextures() {
    NachenTex = gl.createTexture();

    var NachenIm = document.getElementById("NachenImage");
    var SmallbergIm = document.getElementById("SmallbergImage");

    gl.bindTexture( gl.TEXTURE_2D, NachenTex );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, NachenIm );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );


    gl.activeTexture(gl.TEXTURE0 + 1);
    SmallbergTex = gl.createTexture();

    gl.bindTexture( gl.TEXTURE_2D, SmallbergTex );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, SmallbergIm );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.LINEAR_MIP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIP_LINEAR );
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);  
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]); 
     texCoordsArray.push(texCoord[2]); 
   
     pointsArray.push(vertices[a]); 
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]); 
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]); 
     texCoordsArray.push(texCoord[3]);   
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    camera.aspect = canvas.width/canvas.height;
    
    colorCube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    projectionLoc = gl.getUniformLocation(program, "projection");
    modelViewLoc = gl.getUniformLocation(program, "modelView");
    offsetLoc = gl.getUniformLocation(program, "offset");
    imageThetaLoc = gl.getUniformLocation(program, "imageTheta");
    scaleLoc = gl.getUniformLocation(program, "scale");

    window.onkeypress = function(event) {
        var key = String.fromCharCode(event.keyCode).toLowerCase();
        switch(key){
            case 'i': //Zoom in
            camera.z += 0.1;
            break;
            case 'o': //Zoom out
            camera.z -= 0.1;
            break;
            case 'r': //Start and stop the rotation of both cubes
            rot = !rot;
            break;
            case 's': //Start and stop the scrolling of one of the textures
            scroll = !scroll;
            break;
            case 't': //Start and stop the scrolling of one of the textures
            texSpin = !texSpin;
            break;
        }
    }
    configureTextures();
       
    render();
 
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projectionMatrix = perspective(camera.fovx / camera.aspect, camera.aspect, camera.near, camera.far);
    gl.uniformMatrix4fv(projectionLoc, false, flatten(projectionMatrix));

    var viewMatrix = translate(camera.x, camera.y, camera.z);

    for(var i = 0; i < transforms.length; i++){
        //Send the shader the new texture
        gl.uniform1i(gl.getUniformLocation(program, "texture"), i);

        //Account for the cubes rotation aroudn their respective axes
        var modelMatrix = rotate(theta[i], axes[i]);

        modelMatrix = mult(transforms[i], modelMatrix);
        gl.uniformMatrix4fv(modelViewLoc, false, flatten(mult(viewMatrix, modelMatrix)));

        /*When the first cube is being drawn:
            -Send a 0 value for the offset since no offset is needed
            -Send the current angle for the texture, since this is the rotating texture cube
            -Send a scalar value of 1, since the texture is not zoomed in or out
        When the second cube is being drawn:
            -Send the current offset for the scrolling texture
            -Send an angle of 0, since the texture is not rotating
            -Send a scalar of 2 to zoom out the texture*/
        gl.uniform2fv(offsetLoc, i ? offset : [0.0, 0.0]);
        gl.uniform1f(imageThetaLoc, i ? 0.0 : imageTheta);
        gl.uniform1f(scaleLoc, i ? 2.0 : 1.0);

        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    }

    if (rot){
        //1 is used for 10 rpm
        //0.5 is used for 5 rpm
        theta[0] = (theta[0] + 1) % 360;
        theta[1] = (theta[1] + 0.5) % 360;
    }
    if (scroll){
        offset[0]= (offset[0] + 0.01) % 1.0;
    }
    if (texSpin){
        //1.5 is used for 15 rpm
        imageTheta = (imageTheta + 1.5) % 360;;
    }
    requestAnimFrame(render);
}