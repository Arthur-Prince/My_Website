// Definindo a classe MouseTracker
class MouseTracker {
    constructor(canvas) {
        // O canvas onde o mouse será rastreado
        this.canvas = canvas;

        // Vetor 4D para armazenar a posição normalizada e o estado dos botões do mouse
        this.mouseVec4 = new Float32Array([0.0, 0.0, 0.0, 0.0]);

        // Adicionando os event listeners no canvas
        this.canvas.addEventListener('mousemove', (event) => this.updateMouse(event));
        this.canvas.addEventListener('mousedown', (event) => this.updateMouse(event));
        this.canvas.addEventListener('mouseup', (event) => this.updateMouse(event));

        // Impede o menu de contexto ao clicar com o botão direito do mouse
        this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    }

    // Atualiza as informações do mouse (posição e estado dos cliques)
    updateMouse(event) {
        // Obtém a posição do mouse em relação ao canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Normaliza as coordenadas para o intervalo [-1, 1] para o WebGL
        this.mouseVec4[0] = x;  // Coordenada X normalizada
        this.mouseVec4[1] = y;  // Coordenada Y normalizada

        // Verifica o tipo de evento (mousedown ou mouseup) e atualiza o estado dos botões do mouse
        if (event.type === 'mousedown' || event.type === 'mouseup') {
            const isDown = event.type === 'mousedown';
            if (event.button === 0) {
                // Botão esquerdo
                this.mouseVec4[2] = isDown ? 1.0 : 0.0;
            } else if (event.button === 2) {
                // Botão direito
                this.mouseVec4[3] = isDown ? 1.0 : 0.0;
            }
        }
    }

    // Retorna o vetor mouseVec4
    getMouseVec4() {
        return this.mouseVec4;
    }
}