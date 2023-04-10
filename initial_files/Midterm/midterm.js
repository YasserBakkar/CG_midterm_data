var canvas;
var gl;
var vPosition;
var program;

// TODO: define any global variables you need
var letter1vertices, letter2vertices;
var bufferY, buffer2;
//var color, colorLoc;
var posX = 0, posY = 0;
var scaleXUniformLocation=1.0;
var scaleYUniformLocation=1.0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(posX, posY, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create geometry data
    letter1vertices = [vec2(-0.5, 0.4),
    vec2(-0.6, 0.8),
    vec2(-0.8, 0.8),
    vec2(-0.6, 0.1),
    vec2(-0.6, -0.3),
    vec2(-0.4, -0.3),
    vec2(-0.4, 0.1),
    vec2(-0.2, 0.8),
    vec2(-0.4, 0.8),
    vec2(-0.5, 0.4)];

    letterbvertices = [vec2(0.0, -0.3), vec2(-0.1, -0.3), vec2(0.0, 0.8), vec2(-0.1, 0.8)];

    vertices = [];
    vertCount = 2;
    for (var i = 0.0; i <= 180; i += 1) {
        // degrees to radians
        var j = (i * Math.PI) / 180;
        // X Y
        var vert1 = [Math.sin(j) * 0.3, Math.cos(j) * 0.3 + 0.5];

        //width ring
        var vert2 = [Math.sin(j) * 0.2, Math.cos(j) * 0.2 + 0.5];


        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);

    }
    n = vertices.length / vertCount;

    //another semi-colon
    vertices2 = [];
    vertCount2 = 2;
    for (var ii = 0.0; ii <= 180; ii += 1) {
        // degrees to radians
        var jj = (ii * Math.PI) / 180;
        // X Y
        var vert11 = [Math.sin(jj) * 0.3, Math.cos(jj) * 0.3];

        //width ring
        var vert22 = [Math.sin(jj) * 0.2, Math.cos(jj) * 0.2];


        vertices2 = vertices2.concat(vert11);
        vertices2 = vertices2.concat(vert22);

    }
    nn = vertices2.length / vertCount2;



    // TODO: create vertex coordinates for your initial letters instead of these vertices

    // Load the data into the GPU		
    bufferY = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferY);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letter1vertices), gl.STATIC_DRAW);

    buffer0 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer0);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letterbvertices), gl.STATIC_DRAW);

    buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);


    document.getElementById("posX").oninput = function (event) {

        posX = parseFloat(event.target.value);
        posY = parseFloat(document.getElementById("posY").value);
        gl.viewport(posX, posY, canvas.width, canvas.height);

    };
    document.getElementById("posY").oninput = function (event) {

        posY = parseFloat(event.target.value);
        posX = parseFloat(document.getElementById("posX").value);
        gl.viewport(posX, posY, canvas.width, canvas.height);

    };
    document.getElementById("scaleX").oninput = function (event) {

        scaleXUniformLocation = parseFloat(event.target.value);

    };
    document.getElementById("scaleY").oninput = function (event) {

        scaleYUniformLocation= parseFloat(event.target.value);

    };
    document.getElementById("redSlider").oninput = function (event) {
        //    var value = event.target.value;
        //    var element = document.getElementById("element-to-change");
        //    element.style.color = "rgb(" + value + ", 0, 0)";
    };
    document.getElementById("greenSlider").oninput = function (event) {
        //TODO: fill here to adjust color according to slider value
    };
    document.getElementById("blueSlider").oninput = function (event) {
        //TODO: fill here to adjust color according to slider value
    };

    //    colorLoc = gl.getUniformLocation(program,"color");	

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // TODO: Send necessary uniform variables to shader and 
    // perform draw calls for drawing letters

    //Position
    var XLocation = gl.getUniformLocation(program, "posxvalue");
    gl.uniform1f(XLocation, posX);

    var YLocation = gl.getUniformLocation(program, "posyvalue");
    gl.uniform1f(YLocation, posY);

    //Scale
    var scaleXUniformLocations = gl.getUniformLocation(program, "u_ScaleX");
    gl.uniform1f(scaleXUniformLocations,scaleXUniformLocation);

    var scaleYUniformLocations = gl.getUniformLocation(program, "u_ScaleY");
    gl.uniform1f(scaleYUniformLocations,scaleYUniformLocation);



    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferY);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw triangle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, letter1vertices.length);

    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer0);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, letterbvertices.length);
    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.vertexAttribPointer(vPosition, vertCount, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw triangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.vertexAttribPointer(vPosition, vertCount2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw triangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, nn);

    window.requestAnimFrame(render);

    // Color 
    //  color = vec4(Math.random(),Math.random(),Math.random(),1.0);
    //	gl.uniform4fv(colorLoc,color);



}