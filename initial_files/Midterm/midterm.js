var canvas;
var gl;
var vPosition;
var program;

// TODO: define any global variables you need
var letterYvertices, letterBvertices;
var semiCircleUp, semiCircleDown;
var vertexCount, vertexCount2;
var bufferY, bufferB, bufferUp, bufferDown;
var posX = 0, posY = 0;
var xScalingUniform = 1.0;
var yScalingUniform = 1.0;
var color = vec4(1.0, 0.0, 0.0, 1.0);
var yColor = vec4(0.0, 1.0, 1.0, 1.0);

var reversecolor = vec4(1.0 - color[0], 1.0 - color[1], 1.0 - color[2], color[3]);


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
    letterYvertices = [vec2(-0.5, 0.4),
    vec2(-0.6, 0.8),
    vec2(-0.8, 0.8),
    vec2(-0.6, 0.1),
    vec2(-0.6, -0.3),
    vec2(-0.4, -0.3),
    vec2(-0.4, 0.1),
    vec2(-0.2, 0.8),
    vec2(-0.4, 0.8),
    vec2(-0.5, 0.4)];

    letterBvertices = [vec2(0.0, -0.3), vec2(-0.1, -0.3), vec2(0.0, 0.8), vec2(-0.1, 0.8)];

    //semi-CircleUp
    semiCircleUp = [];
    vertexCount = 2;
    for (var i = 0.0; i <= 180; i += 1) {
        // Convert degrees to radians
        var j = (i * Math.PI) / 180;
        // X and Y radii to obtain an elliptic shape
        var vert1 = [Math.sin(j) * 0.3, Math.cos(j) * 0.3 + 0.5];
        //Width of the ring
        var vert2 = [Math.sin(j) * 0.2, Math.cos(j) * 0.2 + 0.5];
        semiCircleUp = semiCircleUp.concat(vert1);
        semiCircleUp = semiCircleUp.concat(vert2);
    }
    num = semiCircleUp.length / vertexCount;

    //semi-CircleDown
    semiCircleDown = [];
    vertexCount2 = 2;
    for (var ii = 0.0; ii <= 180; ii += 1) {
        // Convert degrees to radians
        var jj = (ii * Math.PI) / 180;
        // X and Y radii to obtain an elliptic shape
        var vert11 = [Math.sin(jj) * 0.3, Math.cos(jj) * 0.3];
        //Width of the ring
        var vert22 = [Math.sin(jj) * 0.2, Math.cos(jj) * 0.2];
        semiCircleDown = semiCircleDown.concat(vert11);
        semiCircleDown = semiCircleDown.concat(vert22);
    }
    num2 = semiCircleDown.length / vertexCount2;


    // TODO: create vertex coordinates for your initial letters instead of these vertices

    // Load the data into the GPU		
    bufferY = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferY);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letterYvertices), gl.STATIC_DRAW);

    bufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letterBvertices), gl.STATIC_DRAW);

    bufferUp = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferUp);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(semiCircleUp), gl.STATIC_DRAW);

    bufferDown = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferDown);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(semiCircleDown), gl.STATIC_DRAW);


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

        xScalingUniform = parseFloat(event.target.value);

    };
    document.getElementById("scaleY").oninput = function (event) {

        yScalingUniform = parseFloat(event.target.value);

    };
    document.getElementById("redSlider").oninput = function (event) {
        var val = event.target.value;
        color[0] = val;
        reversecolor[0] = 1.0 - val;
    };
    document.getElementById("greenSlider").oninput = function (event) {
        var val = event.target.value;
        color[1] = val;
        reversecolor[1] = 1.0 - val;
    };
    document.getElementById("blueSlider").oninput = function (event) {
        var val = event.target.value;
        color[2] = val;
        reversecolor[2] = 1.0 - val;
    };

    colorLocation = gl.getUniformLocation(program, "color");
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // TODO: Send necessary uniform variables to shader and 
    // perform draw calls for drawing letters

    //Position
    var xCoordinate = gl.getUniformLocation(program, "xPosition");
    gl.uniform1f(xCoordinate, posX);
    var yCoordinate = gl.getUniformLocation(program, "yPosition");
    gl.uniform1f(yCoordinate, posY);

    //Scale
    var xScalingUniforms = gl.getUniformLocation(program, "xScaleRatio");
    gl.uniform1f(xScalingUniforms, xScalingUniform);
    var yScalingUniforms = gl.getUniformLocation(program, "yScaleRatio");
    gl.uniform1f(yScalingUniforms, yScalingUniform);

    //Color
    gl.uniform4fv(colorLocation, color);
     for (let i = 0; i < letterYvertices.length / 4; i++) {
         const offset = i * 4;
         gl.drawArrays(gl.TRIANGLE_FAN, offset, 4);
     }
    



    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferY);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw Y Letter
    gl.drawArrays(gl.TRIANGLE_FAN, 0, letterYvertices.length);

    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferB);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw B Letter
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, letterBvertices.length);

    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferUp);
    gl.vertexAttribPointer(vPosition, vertexCount, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw semi-CircleUp
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, num);

    // bind vertex buffer and associate position data with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferDown);
    gl.vertexAttribPointer(vPosition, vertexCount2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // draw semi-CircleDown
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, num2);

    window.requestAnimFrame(render);

}