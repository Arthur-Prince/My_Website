// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        
    }).catch(err => {
        console.error('Erro ao copiar', err);
    });
}