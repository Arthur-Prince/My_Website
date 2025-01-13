// Adiciona o painel de desempenho (FPS)
const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS, 2: MB, 3+: personalizado
document.body.appendChild(stats.dom);

// Lógica de animação ou renderização
function animate() {
  stats.begin();

  // Coloque aqui a lógica de animação ou renderização
  // Exemplo: manipulando algo no canvas
  simulateHeavyWorkload();

  stats.end();

  requestAnimationFrame(animate);
}

// Simula uma carga de trabalho pesada para teste
function simulateHeavyWorkload() {
  const canvas = document.querySelector('canvas') || createCanvas();
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `hsl(${Date.now() % 360}, 100%, 50%)`;
  ctx.fillRect(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    50,
    50
  );
}

// Cria um canvas simples
function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  return canvas;
}

// Inicia o loop de animação
animate();

