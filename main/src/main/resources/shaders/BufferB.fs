#version 300 es
precision highp float;

// Uniforms
uniform sampler2D bufferA; // Entrada do FBOA

uniform vec4 mouse;
uniform vec2 resolution;

// Variáveis que vêm do vertex shader
in float time;
flat in int frame;
in vec2 posV; // Coordenadas de textura

out vec4 fragColor;

#include <common.fs>

void main() {
    // Posição da tela
    vec2 pos = gl_FragCoord.xy;
    
	vec2 iR = vec2(textureSize(bufferA, 0));
    
    // Obtenção dos dados da partícula na posição
    vec4 data = texture(bufferA, pos / vec2(textureSize(bufferA, 0)));
    
    // Obtenção da partícula a partir dos dados
    particle P = getParticle(data, pos);
    

    // Se não for vácuo
    if(P.M.x > 0.0) {
        Simulation(bufferA, P, pos);  // Atualiza a partícula com a simulação
        
        if(isNearBorder(P.X, resolution)) {
        	P.V = vec2(0.);
        }
    }

    // Se a partícula estiver dentro da área de criação 1
    if(length(P.X - iR * vec2(0.8, 0.5)) < 20.0) {
        P.X = pos;
        P.V = vec2(-1.);
        P.M = mix(P.M, vec2(fluid_rho, 0.1), 1.0);
    }

    // Se a partícula estiver dentro da área de criação 2
    if(length(P.X - iR * vec2(0.22, 0.5)) < 20.0) {
        P.X = pos;
        P.V = 0.5 * Dir(-PI * 0.25 + 0.3 * sin(0.3 * time));
        P.M = mix(P.M, vec2(fluid_rho, 1.0), 0.4);
    }

    // Envio da partícula modificada para o próximo estágio
    fragColor = saveParticle(P, pos);
}
