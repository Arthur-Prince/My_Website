
class ShaderInfo {
    constructor(nome = '', conteudo = '', tipo = 'VERTEXSHADER') {
        this.nome = nome;
        this.conteudo = conteudo;
        this.tipo = tipo;
    }
}

const Type = {
    VERTEXSHADER: 'VERTEXSHADER',
    FRAGMENTSHADER: 'FRAGMENTSHADER',
    COMMONFRAGMENTSHADER: 'COMMONFRAGMENTSHADER'
};

class programInfo {
    constructor(vertex = null, bufferA = null, bufferB = null, bufferC = null, common = null, image = null) {
        this.vertex = vertex;
        this.bufferA = bufferA;
        this.bufferB = bufferB;
        this.bufferC = bufferC;
        this.common = common;
        this.image = image;
    }

    // Função para substituir os #include <common.fs> pelo conteúdo de common.fs
    replaceIncludeWithContent(shaderCode, commonFsContent) {
        return shaderCode.replace(/#include <common\.fs>/g, commonFsContent);
    }
}

// Variável global para armazenar os dados do programInfo
let globalProgramInfo = null;

// Função assíncrona para obter os shaders e preencher o programInfo
async function loadShaders() {
    try {
        // Fazendo a requisição para obter os dados dos shaders
        const response = await fetch('http://localhost:8080/test/shaders');
        const shaderData = await response.json();

        // Inicializando os ShaderInfo para cada tipo de shader
        const vertexShader = new ShaderInfo(
            shaderData.vertexShader.nome, 
            shaderData.vertexShader.conteudo, 
            Type.VERTEXSHADER
        );

        const bufferA = new ShaderInfo(
            shaderData.bufferA.nome, 
            shaderData.bufferA.conteudo, 
            Type.FRAGMENTSHADER
        );

        const bufferB = new ShaderInfo(
            shaderData.bufferB.nome, 
            shaderData.bufferB.conteudo, 
            Type.FRAGMENTSHADER
        );

        const bufferC = new ShaderInfo(
            shaderData.bufferC.nome, 
            shaderData.bufferC.conteudo, 
            Type.FRAGMENTSHADER
        );

        const common = new ShaderInfo(
            shaderData.common.nome, 
            shaderData.common.conteudo, 
            Type.COMMONFRAGMENTSHADER
        );

        const image = new ShaderInfo(
            shaderData.image.nome, 
            shaderData.image.conteudo, 
            Type.FRAGMENTSHADER
        );

        // Criando a instância do programInfo com os shaders carregados
        globalProgramInfo = new programInfo(vertexShader, bufferA, bufferB, bufferC, common, image);

        // Substituindo #include <common.fs> nos shaders que necessitam
        globalProgramInfo.vertex.conteudo = globalProgramInfo.replaceIncludeWithContent(globalProgramInfo.vertex.conteudo, common.conteudo);
        globalProgramInfo.bufferA.conteudo = globalProgramInfo.replaceIncludeWithContent(globalProgramInfo.bufferA.conteudo, common.conteudo);
        globalProgramInfo.bufferB.conteudo = globalProgramInfo.replaceIncludeWithContent(globalProgramInfo.bufferB.conteudo, common.conteudo);
        globalProgramInfo.bufferC.conteudo = globalProgramInfo.replaceIncludeWithContent(globalProgramInfo.bufferC.conteudo, common.conteudo);

        // Aqui você pode manipular ou retornar o globalProgramInfo como necessário
        return globalProgramInfo;

    } catch (error) {
        console.error("Erro ao carregar shaders: ", error);
    }
}

// Exemplo de como usar a função
loadShaders().then(program => {
    console.log("Shaders carregados:", program);
}).catch(error => {
    console.error("Erro no processamento dos shaders:", error);
});




