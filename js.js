var direction = [0.0, 0.0, 0.0];
var flag = true;
const x = 0;
const y = 1;
const z = 2;
var r = 0;

main();

function main() {
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        alert('error:unable to initialize webGL');
        return;
    }
    const vsSource = `
  attribute vec4 vPosition;
  attribute vec2 texCoord;
  uniform mat4 MVmatrix;
  uniform mat4 Pmatrix;
  varying highp vec2 fTexCoord;
  void main(void){
    gl_Position = Pmatrix*MVmatrix*vPosition;
    fTexCoord = texCoord;
  }
  `;
    const fsSource = `
  varying highp vec2 fTexCoord;
  uniform sampler2D sampler;
  void main(void){
    gl_FragColor = texture2D(sampler,fTexCoord);
  }
  `;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = getProgramInfo(gl, shaderProgram);
    const buffers = initBuffers(gl);
    const texture = loadTexture(gl, 'top_main_miku.png');

    var then = 0;
    requestAnimationFrame(render);

    function render(now) {
        now *= 0.001;
        const dTime = now - then;
        then = now;
        drawScene(gl, programInfo, buffers, texture, dTime);
        requestAnimationFrame(render);
    }
}

function getProgramInfo(gl, shaderProgram) {
    return { //着色器程序的变量
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'texCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'Pmatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'MVmatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'sampler'),
        },
    };
}

function loadTexture(gl, url) { //创建纹理
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const informAt = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, informAt, width, height, border, srcFormat, srcType, pixel);
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, informAt, srcFormat, srcType, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;
    return texture;

    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
}


function initBuffers(gl) { //创建缓冲
    //顶点缓冲
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    const vertices = [
        //前
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        //后
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        //上
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        //下
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        //右
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        //左
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //三角形缓冲
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
        0, 1, 2, 0, 2, 3, // 前
        4, 5, 6, 4, 6, 7, // 后
        8, 9, 10, 8, 10, 11, // 上
        12, 13, 14, 12, 14, 15, // 下
        16, 17, 18, 16, 18, 19, // 右
        20, 21, 22, 20, 22, 23, // 左
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    //纹理映射缓冲
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texcoord = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoord), gl.STATIC_DRAW);
    return {
        position: posBuffer,
        indices: indexBuffer,
        textureCoord: texcoordBuffer,
    };
}

function drawScene(gl, programInfo, buffers, texture, dTime) { //绘制场景
    //配置gl上下文
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //创建变换矩阵
    const fov = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const Znear = 0.1;
    const Zfar = 100.0;
    const Pmatrix = mat4.create();
    mat4.perspective(Pmatrix, fov, aspect, Znear, Zfar);
    const MVmatrix = mat4.create();
    mat4.translate(MVmatrix, MVmatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(MVmatrix, MVmatrix, direction[x], [1, 0, 0]);
    mat4.rotate(MVmatrix, MVmatrix, direction[y], [0, 1, 0]);
    mat4.rotate(MVmatrix, MVmatrix, direction[z], [0, 0, 1]);

    { //传递顶点缓冲到着色器
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition
        );
    }

    { //传递纹理缓冲到着色器
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord
        );
    }

    //传递三角形顶点缓冲到着色器
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    //传递着色器和矩阵到gl
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        Pmatrix
    );
    //在传递矩阵之前进行修改以控制效果
    document.getElementById("x").onclick = function() {
        r = x;
    }
    document.getElementById("y").onclick = function() {
        r = y;
    }
    document.getElementById("z").onclick = function() {
        r = z;
    }
    document.getElementById("p").onclick = function() {
        flag = !flag;
    }
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        MVmatrix
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    { //绘制
        const offset = 0;
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    if (flag) direction[r] += dTime;
}

function initShaderProgram(gl, vsSource, fsSource) { //初始化着色器程序
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('error:initialize program\n' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) { //创建着色器
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('error:compiling shader\n' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
