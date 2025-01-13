let time = 0.0;
let deltaTime = 0;

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;

let canvasHeight = 0;

// Exemplo de como usar a função
loadShaders().then(program => {
  main(program);
}).catch(error => {
  console.error("Erro no processamento dos shaders:", error);
});
//
// start here
//
function main(shaders) {
  const canvas = document.querySelector("#glcanvas");
  const fpsDisplay = document.querySelector("#fps");

  // Initialize the GL context
  const gl = canvas.getContext("webgl2", { alpha: false });

  canvasHeight = canvas.height;

  const mouse = new MouseTracker(canvas);

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }


  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program

  const vsSource = shaders.vertex;

  // Fragment shader program
  const common = shaders.common;

  const SImage = shaders.image;

  const SBufferA = shaders.bufferA;

  const SBufferB = shaders.bufferB;

  const SBufferC = shaders.bufferC;


  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.

  const shaderProgramImg = initShaderProgram(gl, vsSource, SImage, common);
  const shaderProgramA = initShaderProgram(gl, vsSource, SBufferA, common);
  const shaderProgramB = initShaderProgram(gl, vsSource, SBufferB, common);
  const shaderProgramC = initShaderProgram(gl, vsSource, SBufferC, common);


  const FBOimg = new ShaderManager(gl, shaderProgramImg);
  const FBOA = new ShaderManager(gl, shaderProgramA);
  const FBOB = new ShaderManager(gl, shaderProgramB);
  const FBOC = new ShaderManager(gl, shaderProgramC);

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  setVertexAttributes(gl, buffers, FBOimg.programInfo);

  let then = 0;
  let frame = 0;

  const values = new Values();

  values.setResolution(gl.drawingBufferWidth, gl.drawingBufferHeight);
  values.setMouse(mouse.mouseVec4);

  // Draw the scene repeatedly
  // Função de renderização
  function render(now) {
    frame++;
    values.setTime(time);
    values.setFrame(frame);
    now *= 0.001; // converte para segundos
    deltaTime = now - then;
    then = now;

    // Conta o número de quadros renderizados
    frameCount++;

    // Calcular o FPS a cada segundo (1000ms)
    if (now - lastFrameTime >= 1) {

      fps = frameCount;
      frameCount = 0;
      lastFrameTime = now;

      // Exibe o FPS na tela
      fpsDisplay.textContent = `FPS: ${fps}`;
    }


    //////////////////////////////////////////////////////////////
    FBOA.bindFramebuffer();
    // Desenha a cena
    updateScene(gl, FBOA, buffers, values);
    FBOA.setUniform(FBOB.texture, 1, "bufferB");
    FBOA.bindTexture(0);
    drawScene(gl);


    gl.finish();


    //////////////////////////////////////////////////////////////


    FBOB.bindFramebuffer();
    // Desenha a cena
    updateScene(gl, FBOB, buffers, values);
    FBOB.setUniform(FBOA.texture, 0, "bufferA");

    FBOB.bindTexture(1);
    drawScene(gl);

    gl.finish();




    //////////////////////////////////////////////////////////////


    bindCanvas(gl);


    clearframeBuffer(gl);

    updateScene(gl, FBOimg, buffers, values);
    FBOimg.setUniform(FBOA.texture, 0, "bufferA");
    FBOimg.setUniform(FBOB.texture, 1, "bufferB");

    drawScene(gl);
    gl.finish();

    time += deltaTime;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource, common) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource, common);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource, common);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source, common) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, replaceIncludeWithContent(source.conteudo, common.conteudo));

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `An error occurred compiling the shaders:` + source.nome + ` ${gl.getShaderInfoLog(shader)}`
    );
    console.log(source.conteudo);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function printPixelValueAtMouse(gl, mousePosVec4, texture) {
  // Extrai x e y do vec4
  const x = Math.floor(mousePosVec4[0]);
  const y = Math.floor(mousePosVec4[1]);

  // Inverte o Y, pois WebGL considera (0,0) no canto inferior esquerdo
  const invertedY = (canvasHeight - 1) - y;

  // Cria e vincula um framebuffer temporário
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // Anexa a textura ao FBO como COLOR_ATTACHMENT0
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  // Verifica se o FBO está completo
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Framebuffer não está completo:", status);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    return;
  }

  // Lê o pixel na posição (x, invertedY)
  const pixelData = new Float32Array(4);
  gl.readPixels(x, invertedY, 1, 1, gl.RGBA, gl.FLOAT, pixelData);

  // Imprime o valor RGBA (cada canal é um float)
  console.log(
    `Pixel em (${x}, ${invertedY}): ` +
    `R=${pixelData[0]}, G=${pixelData[1]}, B=${pixelData[2]}, A=${pixelData[3]}`
  );

  // Desvincula e deleta o FBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(fbo);
}


