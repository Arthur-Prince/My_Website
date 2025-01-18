document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const responseMessage = document.getElementById("responseMessage");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const submitButton = form.querySelector('button[type="submit"]'); // Seleciona o botão de envio

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        // Exibe o indicador de carregamento e desabilita o botão
        loadingIndicator.style.display = "block";
        submitButton.disabled = true; // Desabilita o botão de envio
        responseMessage.innerHTML = ""; // Limpa mensagens anteriores

        // Captura os dados do formulário
        const formData = new FormData(form);
        const data = {
            nome: formData.get("nome"),
            assunto: formData.get("assunto"),
            message: formData.get("message"),
        };

        try {
            // Envia os dados como JSON para o backend
            const response = await fetch("/contato/msg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error("Erro ao enviar a mensagem. Tente novamente.");
            }

            // Lê o corpo da resposta como texto ou JSON
            const result = await response.json();

            // Exibe a mensagem de sucesso na div
            responseMessage.innerHTML = `
                <p style="color: green;">${result.message}</p>
            `;
            form.reset(); // Limpa todos os campos do formulário
        } catch (error) {
            // Exibe uma mensagem de erro na div
            responseMessage.innerHTML = `
                <p style="color: red;">Erro: ${error.message}</p>
            `;
        } finally {
            // Oculta o indicador de carregamento e reabilita o botão
            loadingIndicator.style.display = "none";
            submitButton.disabled = false; // Reabilita o botão de envio
        }
    });
});
