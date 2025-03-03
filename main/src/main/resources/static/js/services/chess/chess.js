document.addEventListener("DOMContentLoaded", function () {
  // Cria o container que ocupará 50% da largura da tela (o CSS já define essa classe)
  var container = document.createElement("div");
  container.className = "container";

  // Cria o formulário para editar o título
  var titleForm = document.createElement("form");
  titleForm.className = "title-form";
  titleForm.onsubmit = function(e) {
    e.preventDefault();
    return false;
  };

  // Cria o input para o título
  var titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "titleInput";
  titleInput.placeholder = "Enter new title";
  titleInput.autocomplete = "off";
  titleForm.appendChild(titleInput);

  // Localiza os elementos já inseridos via th:insert
  var pgnForm = document.querySelector("form.pgn-form");
  var chessTitle = document.getElementById("chess-title");

  // Remove os elementos do local original para movê-los para o novo container
  if (pgnForm && pgnForm.parentNode) {
    pgnForm.parentNode.removeChild(pgnForm);
  }
  if (chessTitle && chessTitle.parentNode) {
    chessTitle.parentNode.removeChild(chessTitle);
  }

  // Insere os elementos no container na ordem desejada:
  // 1. Formulário para editar o título
  // 2. O formulário PGN
  // 3. O título (h1) - ficará abaixo do pgn-form
  container.appendChild(titleForm);
  if (pgnForm) container.appendChild(pgnForm);
  if (chessTitle) container.appendChild(chessTitle);

  // Insere o container no início do <body>
  document.body.insertBefore(container, document.body.firstChild);

  // Armazena o valor inicial do título (definido via th:text pelo Thymeleaf)
  var defaultTitle = chessTitle.textContent;

  // Atualiza o título a cada segundo com o valor do input.
  // Se o input estiver vazio, mantém o valor padrão que veio do th:text.
  setInterval(function () {
    var newTitle = titleInput.value.trim();
    chessTitle.textContent = newTitle === "" ? defaultTitle : newTitle;
  }, 1000);
});
