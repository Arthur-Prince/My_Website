class ShaderManager {
	constructor(gl, shaderProgram) {
		this.gl = gl;
		this.program = shaderProgram;
		const ext = gl.getExtension('EXT_color_buffer_float');
		if (!ext) {
			console.error('A extensão EXT_color_buffer_float não está disponível');
		}

		// Criar uma textura para capturar a saída do shader
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA32F,
			gl.drawingBufferWidth,
			gl.drawingBufferHeight,
			0,
			gl.RGBA,
			gl.FLOAT,
			null
		);

		// Parâmetros de filtro (NEAREST para floats)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);

		// Criar um framebuffer e anexar a textura
		this.framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

		// Verifique se o framebuffer está completo
		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status !== gl.FRAMEBUFFER_COMPLETE) {
			console.error("Framebuffer incompleto:", status);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.programInfo = {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, "aPos"),
				textureCoord: gl.getAttribLocation(shaderProgram, "TextCoord")
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
				modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
				frame: gl.getUniformLocation(shaderProgram, "frame"),
				stop: gl.getUniformLocation(shaderProgram, "Stop"),

				time: gl.getUniformLocation(shaderProgram, "Time"),
				resolution: gl.getUniformLocation(shaderProgram, "resolution"),
				mouse: gl.getUniformLocation(shaderProgram, "mouse"),
			},
		};

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	updateUniforms(values) {


		const gl = this.gl
		const programInfo = this.programInfo;
		// Uniforms de matrizes
		if (values.projectionMatrix) {
			gl.uniformMatrix4fv(
				programInfo.uniformLocations.projectionMatrix,
				false,
				values.projectionMatrix
			);
		}

		if (values.modelViewMatrix) {
			gl.uniformMatrix4fv(
				programInfo.uniformLocations.modelViewMatrix,
				false,
				values.modelViewMatrix
			);
		}

		// Uniforms escalares
		if (values.time !== undefined) {
			gl.uniform1f(programInfo.uniformLocations.time, values.time);
		}

		if (values.frame !== undefined) {
			gl.uniform1i(programInfo.uniformLocations.frame, values.frame);
		}

		if (values.stop !== undefined) {
			gl.uniform1f(programInfo.uniformLocations.stop, values.stop);
		}

		// Uniforms vetoriais
		if (values.resolution) {
			gl.uniform2fv(programInfo.uniformLocations.resolution, values.resolution);
		}

		if (values.mouse) {
			gl.uniform4fv(programInfo.uniformLocations.mouse, values.mouse);
		}
	}

	setUniform(texture, textureUnit, uniformName) {
		const gl = this.gl;
		const location = gl.getUniformLocation(this.program, uniformName);
		gl.useProgram(this.program);
		gl.activeTexture(gl.TEXTURE0 + textureUnit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(location, textureUnit);
	}

	bindTexture(textureUnit = 0) {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE0 + textureUnit);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}

	setProgram() {
		const gl = this.gl;
		gl.useProgram(this.programInfo.program);
	}

	bindFramebuffer() {
		const gl = this.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	}

}

class Values {
	constructor({
		projectionMatrix = mat4.create(),
		modelViewMatrix = mat4.create(),
		time = 0.0,
		frame = 0,
		stop = null,
		resolution = null,
		mouse = null
	} = {}) { // Aqui o = {} faz com que o padrão seja um objeto vazio
		this.projectionMatrix = projectionMatrix;
		this.modelViewMatrix = modelViewMatrix;
		this.time = time;
		this.frame = frame;
		this.stop = stop;
		this.resolution = resolution;
		this.mouse = mouse;
	}
	setTime(time) {
		this.time = time;
		this.modelViewMatrix = this.modelViewMatrixMaker(time);

		const fieldOfView = (45 * Math.PI) / 180; // in radians
		const aspect = this.resolution[0] / this.resolution[1];
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
		this.projectionMatrix = projectionMatrix;

	}
	setFrame(frame) {
		this.frame = frame;
	}
	setResolution(width, height) {
		this.resolution = [parseFloat(width), parseFloat(height)];
	}
	setMouse(mouse) {
		this.mouse = mouse;
	}

	modelViewMatrixMaker(cubeRotation) {
		const modelViewMatrix = mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		mat4.translate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to translate
			[-0.0, 0.0, -6.0]
		); // amount to translate

		/*mat4.rotate(
		  modelViewMatrix, // destination matrix
		  modelViewMatrix, // matrix to rotate
		  cubeRotation, // amount to rotate in radians
		  [0, 0, 1]
		); // axis to rotate around (Z)
		mat4.rotate(
		  modelViewMatrix, // destination matrix
		  modelViewMatrix, // matrix to rotate
		  cubeRotation, // amount to rotate in radians
		  [0, 1, 0]
		); // axis to rotate around (Y)
		mat4.rotate(
		  modelViewMatrix, // destination matrix
		  modelViewMatrix, // matrix to rotate
		  cubeRotation, // amount to rotate in radians
		  [1, 0, 0]
		); // axis to rotate around (X)*/

		return modelViewMatrix;
	}

}


