
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
}

// Função para substituir os #include <common.fs> pelo conteúdo de common.fs
function replaceIncludeWithContent(shaderCode, commonFsContent) {
    return shaderCode.replace("#include <common\.fs>", commonFsContent);
}

// Variável global para armazenar os dados do programInfo
let globalProgramInfo = null;

// Função assíncrona para carregar os shaders e preencher o programInfo
async function loadShaders() {
    try {
        // Fazendo a requisição para obter os dados dos shaders
        const response = await fetch(serverAddress+'/test/shaders');
        const shaderArray = await response.json(); // Assumindo que é um array com os shaders

        // Criando um mapa para associar nomes de shaders aos seus tipos
        const shaderMap = {};
        shaderArray.forEach(shader => {
            shaderMap[shader.nome.toLowerCase()] = new ShaderInfo(
                shader.nome,
                shader.conteudo,
                shader.type === "vs" ? Type.VERTEXSHADER : Type.FRAGMENTSHADER
            );
        });

        // Criando a instância de programInfo usando os shaders carregados
        const globalProgramInfo = new programInfo(
            shaderMap["vertexshader"],
            shaderMap["buffera"],
            shaderMap["bufferb"],
            shaderMap["bufferc"],
            shaderMap["common"],
            shaderMap["image"]
        );



        // Retornando ou armazenando globalProgramInfo
        return globalProgramInfo;

    } catch (error) {
        console.error("Erro ao carregar shaders: ", error);
    }
}







