function updateScene(gl, framebuffer, buffers, values) {





	framebuffer.setProgram();
	framebuffer.updateUniforms(values);

}

function bindCanvas(gl) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawScene(gl) {
	const vertexCount = 6;
	const type = gl.UNSIGNED_INT;
	const offset = 0;
	gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

function clearframeBuffer(gl) {


	gl.clearColor(1.0, 1.0, 1.0, 1.0); // Clear to black, fully opaque

	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setVertexAttributes(gl, buffers, programInfo) {

	// Posição
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

	// Coordenadas de textura
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoords);
	gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
}



