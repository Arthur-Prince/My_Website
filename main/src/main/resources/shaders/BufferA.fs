#version 300 es
precision highp float;

// Uniforms
uniform sampler2D bufferB; // Entrada do FBOB
uniform int Frame;

// Variáveis que vêm do vertex shader
in float time;
in vec2 posV; // Coordenadas de textura

out vec4 fragColor;

#include <common.fs>

void main() {

	vec2 uv = gl_FragCoord.xy;
	vec4 data = texture(bufferB, uv / vec2(textureSize(bufferB, 0)));
	
	particle P;
    P.X = vec2(0.0);
    P.V = vec2(0.0);
    P.M = vec2(0.0);
    
    Reintegration(bufferB, P, uv);

    // Condição inicial
    if (time < 1.) {
        // Geração de números aleatórios (hash32)
        vec3 rand = hash32(uv);  // hash32 deve estar definida em outro arquivo
        if (rand.z < 0.0) {
            P.X = uv;
            P.V = vec2(0.0);
            P.M = mix(P.M, vec2(fluid_rho, 1.0 - rand.z), 0.4);
        } else {
            P.X = uv;
            P.V = vec2(0.0);
            P.M = vec2(0.0);
        }
    }
    
    
    
    
	
    fragColor = saveParticle(P, uv);
    
    
    
    
    
    
}
