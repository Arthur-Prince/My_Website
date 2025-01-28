document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const messageContainer = document.getElementById('message');

    if (!form || !loginButton || !messageContainer) {
        console.error('Formulário, botão ou contêiner de mensagens não encontrados!');
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Desativa o botão enquanto aguarda a resposta
        loginButton.disabled = true;

        // Captura os dados do formulário em um objeto
        const formData = {
            username: form.username.value,
            password: form.password.value,
        };

        // Envia os dados para a rota /login/logar
        fetch('/login/logar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Define o cabeçalho como JSON
            },
            body: JSON.stringify(formData), // Converte o objeto para uma string JSON
        })
            .then(response => {
                // Reativa o botão
                loginButton.disabled = false;

                if (response.ok) {
                    // Se o login for válido, redireciona para /home
                    window.location.href = '/home';
                } else {
                    // Se o login for inválido, exibe uma mensagem em vermelho
                    return response.text().then(errorMessage => {
                        messageContainer.textContent = errorMessage;
                        messageContainer.style.color = 'red';
                    });
                }
            })
            .catch(error => {
                // Em caso de erro na conexão
                loginButton.disabled = false;
                messageContainer.textContent = 'Erro na conexão. Tente novamente.';
                messageContainer.style.color = 'red';
                console.error('Erro na conexão:', error);
            });
    });
});
