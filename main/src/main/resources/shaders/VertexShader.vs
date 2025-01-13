#version 300 es

// Atributos de entrada
in vec4 aPos;
in vec2 TextCoord;

// Uniforms
uniform float Time;
uniform int Frame;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// Varyings para passar dados para o fragment shader
out float time;
flat out int frame;
out vec2 posV;

void main() {
    // Calcula a posição final do vértice
    gl_Position = aPos;
    
    // Passa os dados para o fragment shader
    time = Time;
    posV = TextCoord;
}
