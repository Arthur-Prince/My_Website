#version 300 es
precision highp float;

// Uniforms
uniform sampler2D bufferA;
in vec2 R;
in float time;
in vec4 mouse;

// Output
out vec4 fragColor;

#include <common.fs>

void main()
{
    // Posição da tela
    vec2 pos = gl_FragCoord.xy;
    ivec2 p = ivec2(pos);

    // Obtenção dos dados da partícula na posição
    vec4 data = texture(bufferA, pos / vec2(textureSize(bufferA, 0)));
    particle P = getParticle(data, pos);
    
    // Inicializa a densidade (rho)
    vec4 rho = vec4(0.0);
    
    // Laços para percorrer os vizinhos (-1, 0, 1)
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 ij = vec2(i, j);
            
            // Obtém os dados da partícula vizinha
            vec4 neighborData = texture(bufferA, (pos + ij) / vec2(textureSize(bufferA, 0)));
            particle P0 = getParticle(neighborData, pos + ij);
            
            vec2 x0 = P0.X; // Atualiza a posição
            // Calcula a quantidade de massa que cai neste pixel
            rho += 1.0 * vec4(P.V, P.M) * G((pos - x0) / 0.75);
        }
    }
    
    // Resultado final
    fragColor = rho;
}
