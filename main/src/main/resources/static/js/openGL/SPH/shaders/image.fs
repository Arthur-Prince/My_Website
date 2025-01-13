#version 300 es
precision highp float;

// Uniforms
uniform sampler2D bufferA;
uniform sampler2D bufferB;
uniform sampler2D bufferC;
uniform sampler2D stop;

// Entrada do fragmento
in vec2 R;
in float time;
in vec4 mouse;
in vec2 posV;

// Saída
out vec4 col;

// Função para converter HSV para RGB
vec3 hsv2rgb( in vec3 c ) {
    vec3 rgb = clamp( abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0 );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb); // Smoothing cúbico
    return c.z * mix( vec3(1.0), rgb, c.y);
}

// Função para fazer uma mistura não linear
vec3 mixN(vec3 a, vec3 b, float k) {
    return sqrt(mix(a*a, b*b, clamp(k, 0.0, 1.0)));
}

// Função para acessar o pixel do buffer
vec4 V(vec2 p) {
    return texture(bufferC, p);
}


void main()
{
    // vec2 pos = gl_FragCoord.xy;
    // ivec2 p = ivec2(pos);
    
    // // Obtendo dados da textura bufferA
    // vec4 data = texture(bufferA, pos / vec2(textureSize(bufferA, 0)));
    // particle P = getParticle(data, pos);
    
    // // Border render
    // vec3 Nb = bN(P.X);
    // float bord = smoothstep(2.0 * border_h, border_h * 1.0, border(pos));
    
    // // Obtendo a densidade da partícula
    // vec4 rho = V(pos);
    // vec3 dx = vec3(-2.0, 0.0, 2.0);
    // vec4 grad = -0.5 * vec4(V(pos + dx.zy).zw - V(pos + dx.xy).zw,
    //                        V(pos + dx.yz).zw - V(pos + dx.yx).zw);
    // vec2 N = pow(length(grad.xz), 0.2) * normalize(grad.xz + 1e-5);
    // float specular = pow(max(dot(N, Dir(1.4)), 0.0), 3.5);
    // float specularb = G(0.4 * (Nb.zz - border_h)) * pow(max(dot(Nb.xy, Dir(1.4)), 0.0), 3.0);
    
    // // Cálculo das cores
    // float a = pow(smoothstep(fluid_rho * 0.0, fluid_rho * 2.0, rho.z), 0.1);
    // float b = exp(-1.7 * smoothstep(fluid_rho * 1.0, fluid_rho * 7.5, rho.z));
    // vec3 col0 = vec3(1.0, 0.5, 0.0);
    // vec3 col1 = vec3(0.1, 0.4, 1.0);
    // vec3 fcol = mixN(col0, col1, tanh(3.0 * (rho.w - 0.7)) * 0.5 + 0.5);
    
    // // Definindo a cor final
    // col = vec4(3.0);
    // col.xyz = mixN(col.xyz, fcol.xyz * (1.5 * b + specularb * 5.0), a);
    // col.xyz = mixN(col.xyz, 0.0 * vec3(0.7, 0.7, 1.0), bord);
    // col.xyz = tanh(col.xyz);
    
    // // Verificando se a partícula está dentro de uma área de parada
    // vec2 proxP = posV + P.V + P.X;
    // vec4 pixel = texture(stop, proxP / vec2(textureSize(stop, 0)));
    // if (pixel.x < 0.1 && pixel.y < 0.1 && pixel.z < 0.1)
    // {
    //     col = pixel;
    // }

    col = vec4(0.0);
}
