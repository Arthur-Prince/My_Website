const projects = {
    java: {
        title: "Java",
        trajetoria: "Java foi a primeira linguagem de programação que aprendi. Estudo ela desde 2018 e todos os meus primeiros projetos foram desenvolvidos usando-a.",
        items: [
            {
                name: "Automação de Coleta de Dados de Combustíveis",
                resumo: "Desenvolvi uma solução completa para automatizar a coleta de preços de combustíveis em múltiplos sites e contas em paralelo usando Java e OkHttp3. O projeto incluiu a criação de um banco de dados MySQL, uma interface web simples para visualização e interação, e um servidor baseado no framework Spring para gerenciar a comunicação entre o scraper, o banco e a interface.",
                
            },
            {
                name: "Bot de Trade de Criptomoedas",
                resumo: "Desenvolvi um bot de trade com Java, utilizando APIs do bxbot e algoritmos do ta4j para criar estratégias automatizadas.",
            },
            {
                name: "semi-SPH-3D-Vulkan",
                resumo: "Após o desenvolver o projeto de dissertação com C++, meu interesse pelo tema cresceu ainda mais, levando-me a explorar, por iniciativa própria, novas maneiras de expandir a eficiência do método SPH. Motivado por uma curiosidade sobre a organização de estruturas de paralelização e o funcionamento da pipeline de renderização, estabeleci como desafio pessoal a adaptação do algoritmo para um ambiente tridimensional, utilizando a biblioteca Vulkan, e a linguagem java.",
                link: "https://github.com/Arthur-Prince/semi-SPH-3D-Vulkan"
            },
        ],
        github: "https://github.com/Arthur-Prince"
    },
    python: {
        title: "Python",
        trajetoria: "Comecei a usar Python em 2020 para automação, análise de dados e projetos de aprendizado de máquina.",
        items: [
            {
                name: "Problema de Roteamento de Veículos Dinâmico Aplicado nas Instâncias da LoggiBud.",
                resumo: "projeto de dissertação que foi realizado em Python e abordou o problema de roteamento de veículos(uma generalização do famoso problema do caixeiro viajante) com uma base de dados fornecida por uma empresa de entregas. Para isso, utilizei técnicas de machine learning e de metaheurísticas para a resolução desse problema de otimização linear.",
                
            },
            
        ],
        github: "https://github.com/Arthur-Prince"
    },
    javascript: {
        title: "JavaScript",
        trajetoria: "JavaScript tem sido uma das linguagens que mais utilizo para projetos web interativos e desenvolvimento front-end.",
        items: [
            {
                name: "este site",
                resumo: "projeto com o fim de ser um site pessoal em que eu coloco tudo que eu achar interessante sobre mim. Ele foi desenvolvido usando js/html/css no frontend e java com spring para o desenvolvimento backend. Nele usei diversas bibliotecas como pdfObject, pngweb e webg para o frontend. O backend foi usado o thymeleaf e o mail para enviar as páginas html e me enviar email de contato. Hoje a aplicação tem sua própria imagem docker e esta rodando em uma instância ec2 na aws",
            	link: "https://github.com/Arthur-Prince/My_Website/tree/master",
            },
        ],
        github: "https://github.com/Arthur-Prince"
    },
    cpp: {
        title: "C/C++",
        trajetoria: "Uso C e C++ para projetos que demandam alto desempenho, como simulações e sistemas embutidos.",
        items: [
            {
                name: "Características de uma Implementação em Paralelo do Método SPH com o Uso da Tecnologia de GLSL (OpenGL Shading Language)",
                resumo: "dediquei-me ao estudo e desenvolvimento de uma simulação de fluidos com o método SPH (Smoothed-particle hydrodynamics) aplicada a um ambiente em 2D. Esse projeto foi elaborado em C++ e OpenGL, e tinha como foco investigar técnicas de paralelização que permitissem executar tanto a renderização quanto o cálculo das forças e do posicionamento das partículas diretamente na GPU",
                link: "https://github.com/Arthur-Prince/Opengl-IC"
            },
        ],
        github: "https://github.com/Arthur-Prince"
    }
};
// Atualiza os detalhes do projeto
function updateProjectDetails(language) {
    const projectDetails = projects[language];
    const projectTitle = document.getElementById('language-title');
    const projectTrajetoria = document.getElementById('language-trajetoria');
    const projectList = document.getElementById('project-list');
    const githubLink = document.getElementById('github-link');

    // Atualiza título e trajetória
    projectTitle.textContent = projectDetails.title;
    projectTrajetoria.textContent = projectDetails.trajetoria;

    // Atualiza a lista de projetos
    projectList.innerHTML = '';
    projectDetails.items.forEach(project => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h4>${project.name}</h4>
            <p>${project.resumo}</p>
            <div class="project-details-more">${project.descriçãoDetalhada}</div>
            <div class="project-buttons">
                ${project.link ? `<a href="${project.link}" target="_blank">Ver no GitHub</a>` : ""}
            </div>
        `;

        // Seleciona os elementos criados
        const showMore = listItem.querySelector('.show-more');
        const details = listItem.querySelector('.project-details-more');

        // Oculta os detalhes inicialmente
        details.style.display = 'none';

        

        projectList.appendChild(listItem);
    });

    // Atualiza o link do GitHub
    githubLink.href = projectDetails.github;

    // Mostra os detalhes
    document.getElementById('project-details').classList.remove('hidden');
}

// Seleciona Java como padrão e configura os eventos
document.addEventListener('DOMContentLoaded', () => {
    const defaultLanguage = document.querySelector('.language[data-language="java"]');
    selectLanguage(defaultLanguage);
    updateProjectDetails('java');

    document.querySelectorAll('.language').forEach(language => {
        language.addEventListener('click', () => {
            const selectedLanguage = language.dataset.language;
            selectLanguage(language);
            updateProjectDetails(selectedLanguage);
        });
    });
});

// Função para selecionar a linguagem
function selectLanguage(languageElement) {
    document.querySelectorAll('.language').forEach(lang => {
        lang.classList.remove('selected');
    });
    languageElement.classList.add('selected');
}

document.getElementById('download-cv').addEventListener('click', async () => {
        try {
            const response = await fetch('/portfolio/download', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Erro ao baixar o currículo.');
            }

            // Converte a resposta em um blob
            const blob = await response.blob();

            // Cria um link temporário para download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'arthur-curriculo.pdf'; // Nome do arquivo baixado
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Libera o objeto da memória
        } catch (error) {
            alert('Falha ao baixar o currículo: ' + error.message);
        }
    });
