#version 300 es

precision highp float;

// Uniforms
uniform sampler2D bufferB;
uniform int Frame;
uniform sampler2D stop;
in vec4 mouse;
in vec2 R;
in float time;
in vec2 posV;

// Output
out vec4 U;

#include <common.fs>

void main() {
    vec2 pos = gl_FragCoord.xy;
    ivec2 p = ivec2(pos);
    vec4 data = texelFetch(bufferB, p, 0);  // Usando texelFetch para WebGL2

    particle P;
    P.X = vec2(0.0);
    P.V = vec2(0.0);
    P.M = vec2(0.0);

    // Condição inicial
    if (Frame < 1) {
        // Geração de números aleatórios (hash32)
        vec3 rand = hash32(pos);  // hash32 deve estar definida em outro arquivo
        if (rand.z < 0.0) {
            P.X = pos;
            P.V = 0.5 * (rand.xy - 0.5) + vec2(0.0, -0.5);
            P.M = mix(P.M, vec2(fluid_rho, 1.0 - rand.z), 0.4);
        } else {
            P.X = pos;
            P.V = vec2(0.0);
            P.M = vec2(0.0);
        }
    }

    // Função Reintegration
    Reintegration(bufferB, P, pos);  // Reintegration deve ser definida em outro arquivo

    // Laço de verificação usando for ao invés de range
//    for (int i = -1; i <= 1; i++) {
//        for (int j = -1; j <= 1; j++) {
//            vec2 t = vec2(i, j);
//            vec4 pixel = texture(stop, posV + t);
//            if (pixel.x < 0.1 && pixel.y < 0.1 && pixel.z < 0.1) {
//                P.V = vec2(0.0, 0.0);
//            }
//        }
//    }

    // Salvando a partícula
    U = saveParticle(P, pos);  // saveParticle deve estar definida em outro arquivo
}
