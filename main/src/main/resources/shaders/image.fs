#version 300 es
precision highp float;

// Uniforms
uniform sampler2D bufferA;
uniform sampler2D bufferB;
uniform sampler2D bufferC;
uniform sampler2D stop;

uniform vec4 mouse;
uniform vec2 resolution;

// Entrada do fragmento
in float time;
in vec2 posV;

// Saída
out vec4 col;

#include <common.fs>


void main()
{
    


	vec2 pos = gl_FragCoord.xy;
	vec2 uv = gl_FragCoord.xy;
	vec2 iR = vec2(textureSize(bufferA, 0));
	vec4 data = texture(bufferA, pos / vec2(textureSize(bufferA, 0)));
	
	vec4 data2 = texel(bufferB, pos);

    // Obtenção da partícula a partir dos dados
    particle P = getParticle(data, pos);
    particle P2 = getParticle(data2, pos);
    
    
   
    
    
    if(isNearBorder(uv, resolution)){
    	col = vec4(0.5);
    }else{
    	col = vec4(P.M.x);
    
    }
    
    
    
    
    
}
