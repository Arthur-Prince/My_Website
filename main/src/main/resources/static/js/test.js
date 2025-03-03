// Inicializa o CKEditor 4 com a nova toolbar
var editor = CKEDITOR.replace('editor1', {
  width: '100%%',  // O editor ocupará 100% da largura da sua área (definida pelo container)
  height: '60vh', // O editor ocupará 100% da altura da sua área
  
  extraAllowedContent: 'iframe[sandbox]',
  extraPlugins: 'ChessIframe',
  contentsCss: '/css/ckeditor.css',
  toolbar: [
    // Linha 1: Documentos e formatação básica
    { name: 'document', items: ['Source', 'ShowBlocks', 'Maximize'] },
    { name: 'file', items: ['NewPage', 'Save', 'Print'] },
    { name: 'forms', items: ['Form', 'TextField', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Button', 'ImageButton'] },
    '/',
    // Linha 2: Inserção e formatação de blocos
    { name: 'styles', items: ['Format', 'Styles'] },
    { name: 'font', items: ['Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript'] },
    { name: 'insert', items: ['Link', 'Image', 'Youtube', 'Table', 'CodeSnippet', 'ChessIframe', 'Iframe'] },
    { name: 'special', items: ['Symbol'] },
    { name: 'blocks', items: ['Blockquote'] },
    { name: 'alignment', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'list', items: ['BulletedList', 'NumberedList', 'TodoList', 'Outdent', 'Indent'] }
  ],
  language: 'pt'
});

function updatePreview() {
  // Elementos de referência
  var previewHost = document.getElementById('previewContent');

  // 1. Obtém o conteúdo do editor e cria um container temporário.
  var data = editor.getData();
  var tempContainer = document.createElement('div');
  tempContainer.innerHTML = data;

  // 2. Processa os iframes do novo conteúdo:
  // Para cada iframe.allow-scripts-iframe encontrado, ajusta o sandbox e "registra" no container persistente.
  var newIframes = tempContainer.querySelectorAll('iframe.allow-scripts-iframe');
  newIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (!id) return; // ignora iframes sem id

    // Ajusta o sandbox para incluir "allow-scripts".
    var sandbox = iframe.getAttribute('sandbox') || '';
    if (!sandbox.includes('allow-scripts')) {
      sandbox = sandbox ? sandbox + ' allow-scripts' : 'allow-scripts';
      iframe.setAttribute('sandbox', sandbox.trim());
    }
    iframe.setAttribute('slot', id+'-slot');

    // Procura no previewHost se já existe um iframe com esse id.
    var exists = previewHost.querySelector('iframe.allow-scripts-iframe[id="' + id + '"]');
    if (!exists) {
      // Se não existe, move (reparenta) o iframe para o previewHost.
      // Usamos appendChild para mover o elemento (não clona).
      previewHost.appendChild(iframe);
    }
  });

  // 3. Remove do previewHost quaisquer iframes que não estão presentes no novo HTML.
  var newIds = [];
  newIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (id) newIds.push(id);
  });
  var persistentIframes = previewHost.querySelectorAll('iframe.allow-scripts-iframe');
  persistentIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (newIds.indexOf(id) === -1) {
      iframe.parentNode.removeChild(iframe);
    }
  });

  // 4. No container temporário, substitui cada iframe.allow-scripts-iframe por um placeholder <div>.
  //    A div terá id="{id}-div" e data-iframe-id="{id}".
  var editorIframes = tempContainer.querySelectorAll('iframe.allow-scripts-iframe');
  editorIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
	if (!id) return;
	
	// Cria a div placeholder com id e atributo data-iframe-id
	var placeholder = document.createElement('div');
	placeholder.setAttribute('id', id + '-div');
	placeholder.setAttribute('data-iframe-id', id);
	placeholder.className = 'iframe-placeholder';
	
	// Cria o slot, define o atributo name igual ao id e adiciona na div placeholder
	var slotElem = document.createElement('slot');
	//slotElem.setAttribute('name', id+'-slot');
	slotElem.setAttribute('name', id+'-slot');
	placeholder.appendChild(slotElem);
	
	// Substitui o iframe pelo placeholder no container temporário.
	iframe.parentNode.replaceChild(placeholder, iframe);

  });

	// --- Passo 6: Cria/Atualiza o shadow DOM do previewHost ---
  if (!previewHost.shadowRoot) {
    previewHost.attachShadow({ mode: 'open' });
  }
  previewHost.shadowRoot.innerHTML = tempContainer.innerHTML;
  
  
}


// Atualiza a pré-visualização quando o editor estiver pronto e a cada mudança
editor.on('instanceReady', updatePreview);
editor.on('change', updatePreview);


document.getElementById('previewButton').addEventListener('click', function() {
      // Obter valores do formulário
      var title = document.getElementById('titleInput').value;
      var description = document.getElementById('descriptionInput').value;
      var imageInput = document.getElementById('imageInput');
      
      // Atualizar o título e a descrição do card
      if (title) {
        document.getElementById('previewTitle').textContent = title;
      }
      if (description) {
        document.getElementById('previewDescription').textContent = description;
      }
      
      // Se houver uma imagem selecionada, atualizar a imagem do preview
      if (imageInput.files && imageInput.files[0]) {
        var file = imageInput.files[0];
        // Cria uma URL temporária para exibir a imagem
        var imageUrl = URL.createObjectURL(file);
        document.getElementById('previewImage').src = imageUrl;
        // Revoga a URL após o carregamento para liberar memória
        document.getElementById('previewImage').onload = function() {
          URL.revokeObjectURL(imageUrl);
        };
      }
    });


// Alterna a visibilidade do editor com base no tipo selecionado
    var typeSelect = document.getElementById('typeSelect');
    var editorContainer = document.getElementById('editorContainer');
    typeSelect.addEventListener('change', function() {
      if (this.value === 'post') {
        editorContainer.style.display = 'flex';
      } else {
        editorContainer.style.display = 'none';
      }
    });


// Botão Commit: Envia os dados do formulário via JSON para /post
    document.getElementById('commitButton').addEventListener('click', function() {
      var type = typeSelect.value;
      var title = document.getElementById('titleInput').value;
      var description = document.getElementById('descriptionInput').value;
      
      // Se for "post", o conteúdo é o do CKEditor; se "diretorio", content será null.
      var content = (type === 'post') ? CKEDITOR.instances.editor1.getData() : null;
      if (type === 'post' && content) {
        // Processa os iframes do conteúdo para garantir o sandbox adequado.
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        var iframes = tempDiv.querySelectorAll('iframe.allow-scripts-iframe');
        iframes.forEach(function(iframe) {
          iframe.setAttribute('sandbox', 'allow-scripts');
        });
        content = tempDiv.innerHTML;
      }
      
      // Função para enviar os dados após ler a imagem (se houver)
      function sendData(imageData) {
        var dataToSend = {
          title: title,
          description: description,
          image: imageData, // base64 ou null
          content: content
        };
        fetch('/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        })
        .then(function(response) {
          if (response.ok) {
            alert('Commit realizado com sucesso!');
          } else {
            alert('Erro ao enviar os dados.');
          }
        })
        .catch(function(error) {
          console.error('Erro:', error);
          alert('Erro ao enviar os dados.');
        });
      }
      
      // Ler a imagem (se houver) como base64; caso contrário, enviar null
      var imageInput = document.getElementById('imageInput');
      if (imageInput.files && imageInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var imageData = e.target.result;
          sendData(imageData);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        sendData(null);
      }
    });
