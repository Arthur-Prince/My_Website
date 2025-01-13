function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);
  const texCoordBuffer = initTexCoordBuffer(gl);
  const indexBuffer = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    texCoords: texCoordBuffer,
    indices: indexBuffer,
  };
}

function initPositionBuffer(gl) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  /*positions = [
    1.0, 1.0, 0.0, 1.0, 1.0, // top right
    1.0, -1.0, 0.0, 1.0, 0.0, // bottom right
    -1.0, -1.0, 0.0, 0.0, 0.0, // bottom left
    -1.0, 1.0, 0.0, 0.0, 1.0 // top left 
  ];*/


  positions = [
    1.0, 1.0, 0.0, // top right
    1.0, -1.0, 0.0, // bottom right
    -1.0, -1.0, 0.0, // bottom left
    -1.0, 1.0, 0.0 // top left 
  ];
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initTexCoordBuffer(gl) {
  const texCoords = [
    1.0, 1.0, // Top right
    1.0, 0.0, // Bottom right
    0.0, 0.0, // Bottom left
    0.0, 1.0 // Top left
  ];

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  return texCoordBuffer;
}

function initIndexBuffer(gl) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0, 1, 3,
    1, 2, 3
  ];

  // Now send the element array to GL

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint32Array(indices),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}