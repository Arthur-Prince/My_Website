#version 300 es

// Atributos de entrada
in vec4 aPos;
in vec2 TextCoord;

// Uniforms
uniform vec4 Mouse;
uniform vec2 Resolution;
uniform float Time;
uniform int Frame;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// Varyings para passar dados para o fragment shader
out float time;
out vec2 R;
out vec4 mouse;
flat out int frame;
out vec2 posV;

void main() {
    // Calcula a posição final do vértice
    gl_Position = uProjectionMatrix * uModelViewMatrix * aPos;
    
    // Passa os dados para o fragment shader
    mouse = Mouse;
    R = Resolution;
    time = Time;
    posV = TextCoord;
}
