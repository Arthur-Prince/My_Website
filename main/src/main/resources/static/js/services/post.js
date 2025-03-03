// Inicializa o CKEditor 4 com a nova toolbar
var editor = CKEDITOR.replace('editor1', {
  width: '100%%',  // O editor ocupará 100% da largura da sua área (definida pelo container)
  height: '60vh', // O editor ocupará 100% da altura da sua área
  
  extraAllowedContent: 'iframe[sandbox]',
  extraPlugins: 'ChessIframe',
  contentsCss: '/css/ckeditor.css',
  filebrowserImageUploadUrl: '/s3/file?dir=temp',
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
  // Elemento de referência onde o preview é persistido
  var previewHost = document.getElementById('previewContent');

  // 1. Obtém o conteúdo do editor e cria um container temporário.
  var data = editor.getData();
  var tempContainer = document.createElement('div');
  tempContainer.innerHTML = data;

  // ===========================
  // Processa iframes (já existente)
  // ===========================
  
  // 2. Para cada iframe.allow-scripts-iframe, ajusta o sandbox e "registra" no previewHost.
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
    // Define o slot para o iframe.
    iframe.setAttribute('slot', id + '-slot');

    // Se o iframe com este id ainda não está no previewHost, move-o.
    var exists = previewHost.querySelector('iframe.allow-scripts-iframe[id="' + id + '"]');
    if (!exists) {
      previewHost.appendChild(iframe);
    }
  });

  // 3. Remove do previewHost quaisquer iframes que não estão presentes no novo HTML.
  var newIframeIds = [];
  newIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (id) newIframeIds.push(id);
  });
  var persistentIframes = previewHost.querySelectorAll('iframe.allow-scripts-iframe');
  persistentIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (newIframeIds.indexOf(id) === -1) {
      iframe.parentNode.removeChild(iframe);
    }
  });

  // 4. No container temporário, substitui cada iframe.allow-scripts-iframe por um placeholder.
  var editorIframes = tempContainer.querySelectorAll('iframe.allow-scripts-iframe');
  editorIframes.forEach(function(iframe) {
    var id = iframe.getAttribute('id');
    if (!id) return;
    
    var placeholder = document.createElement('div');
    placeholder.setAttribute('id', id + '-div');
    placeholder.setAttribute('data-iframe-id', id);
    placeholder.className = 'iframe-placeholder';
    
    var slotElem = document.createElement('slot');
    slotElem.setAttribute('name', id + '-slot');
    placeholder.appendChild(slotElem);
    
    iframe.parentNode.replaceChild(placeholder, iframe);
  });

  // ===========================
  // Processa imagens (nova lógica)
  // ===========================
  
  // 5. Para cada <img> encontrado no conteúdo do editor, assegura que possua um id e define o slot.
  var newImages = tempContainer.querySelectorAll('img');
  newImages.forEach(function(img) {
    // Se não houver id, gera um usando o src e um número aleatório
    
    
      var src = img.getAttribute('src') || 'img';
      var id = src;
      // Remove caracteres que não sejam alfanuméricos, hífen ou underline
      id = id.replace(/[^a-zA-Z0-9\-_]/g, '_');
      img.setAttribute('id', id);
    
    // Define o atributo slot para a imagem
    img.setAttribute('slot', id + '-slot');

    // Se a imagem ainda não está no previewHost, adiciona-a.
    var exists = previewHost.querySelector('img[id="' + id + '"]');
    if (!exists) {
      previewHost.appendChild(img);
    }
  });

  // 6. Remove do previewHost quaisquer imagens que não estejam presentes no novo HTML.
  var newImgIds = [];
  newImages.forEach(function(img) {
    var id = img.getAttribute('id');
    if (id) newImgIds.push(id);
  });
  var persistentImages = previewHost.querySelectorAll('img');
  persistentImages.forEach(function(img) {
    var id = img.getAttribute('id');
    if (id && newImgIds.indexOf(id) === -1) {
      img.parentNode.removeChild(img);
    }
  });

  // 7. No container temporário, substitui cada imagem por um placeholder.
  var editorImages = tempContainer.querySelectorAll('img');
  editorImages.forEach(function(img) {
    var id = img.getAttribute('id');
    if (!id) return;
    
    var placeholder = document.createElement('div');
    placeholder.setAttribute('id', id + '-div');
    placeholder.setAttribute('data-img-id', id);
    placeholder.className = 'img-placeholder';
    
    var slotElem = document.createElement('slot');
    slotElem.setAttribute('name', id + '-slot');
    placeholder.appendChild(slotElem);
    
    img.parentNode.replaceChild(placeholder, img);
  });

  // 8. Cria/Atualiza o shadow DOM do previewHost com o conteúdo do container temporário.
  if (!previewHost.shadowRoot) {
    previewHost.attachShadow({ mode: 'open' });
  }
  previewHost.shadowRoot.innerHTML = tempContainer.innerHTML;
}

/*
function updatePreview() {
  // Elemento onde o preview é persistido
  var previewHost = document.getElementById('previewContent');

  // 1. Obtém o conteúdo do editor e cria um container temporário
  var data = editor.getData();
  var tempContainer = document.createElement('div');
  tempContainer.innerHTML = data;

  // 2. Para cada iframe no novo conteúdo, garante que tenha o sandbox "allow-scripts"
  var tempIframes = tempContainer.querySelectorAll('iframe');
  tempIframes.forEach(function(iframe) {
    // Aqui forçamos o sandbox para "allow-scripts" (pode ajustar se quiser preservar outros valores)
    iframe.setAttribute('sandbox', 'allow-scripts');
  });

  // 3. Obtém os nós (filhos) do container temporário e do previewHost
  var newNodes = Array.from(tempContainer.childNodes);
  var currentNodes = Array.from(previewHost.childNodes);

  // Função de normalização para comparação: ignora diferenças no atributo sandbox para iframes.
  function normalizeNodeForComparison(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      var clone = node.cloneNode(true);
      if (clone.tagName.toLowerCase() === 'iframe') {
        // Remove o atributo sandbox para que a comparação não seja afetada
        clone.removeAttribute('sandbox');
      }
      return clone.outerHTML;
    } else if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    return "";
  }

  // 4. Compara cada nó novo com o nó atual e atualiza somente se necessário
  for (var i = 0; i < newNodes.length; i++) {
    var newNode = newNodes[i];
    var currentNode = currentNodes[i];

    if (!currentNode) {
      // Se não existir o nó atual, adiciona o novo nó
      previewHost.appendChild(newNode.cloneNode(true));
    } else {
      // Compara os nós normalizados
      var normalizedNew = normalizeNodeForComparison(newNode);
      var normalizedCurrent = normalizeNodeForComparison(currentNode);
      if (normalizedNew !== normalizedCurrent) {
        previewHost.replaceChild(newNode.cloneNode(true), currentNode);
      }
    }
  }

  // 5. Remove nós extras no previewHost que não existem no novo conteúdo
  while (previewHost.childNodes.length > newNodes.length) {
    previewHost.removeChild(previewHost.lastChild);
  }
}

*/


// Atualiza a pré-visualização quando o editor estiver pronto e a cada mudança
editor.on('instanceReady', updatePreview);
editor.on('change', updatePreview);


document.getElementById('previewButton').addEventListener('click', function() {
  // Obtém os valores dos campos
  var title = document.getElementById('titleInput').value;
  var description = document.getElementById('descriptionInput').value;
  var imageInput = document.getElementById('imageInput');

  // Atualiza os textos do preview
  if (title) {
    document.getElementById('previewTitle').textContent = title;
  }
  if (description) {
    document.getElementById('previewDescription').textContent = description;
  }
  
  // Se houver um arquivo de imagem selecionado, envia-o para o servidor
  if (imageInput.files && imageInput.files[0]) {
    var file = imageInput.files[0];
    var formData = new FormData();
    formData.append("upload", file); // 'upload' é o nome do parâmetro esperado pelo endpoint

    // Envia a imagem para o endpoint /s3/file?dir=temp
    fetch('/s3/file?dir=temp', {
      method: "POST",
      body: formData
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.url) {
        // Atualiza a imagem do preview com o endereço retornado
        document.getElementById('previewImage').src = data.url;
      } else {
        alert("Erro: URL da imagem não foi retornada.");
      }
    })
    .catch(function(error) {
      console.error("Erro no upload da imagem:", error);
      alert("Erro ao enviar a imagem para o servidor.");
    });
  } else {
    // Se nenhum arquivo for selecionado, mantém o preview ou exibe uma mensagem
    console.warn("Nenhum arquivo selecionado para upload.");
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


function handleSubmit() {
  // Obtém os valores dos inputs
  var type = document.getElementById('typeSelect').value;
  var title = document.getElementById('titleInput').value;
  var description = document.getElementById('descriptionInput').value;
  var directoryValue = document.getElementById('directoryInput').value;
  var previewImage = document.getElementById('previewImage');
  var imageData = previewImage ? previewImage.getAttribute("src") : null;

  if (type === 'post') {
    // Para "post", obtém o conteúdo do CKEditor
    var content = CKEDITOR.instances.editor1.getData();

    // Se houver conteúdo, processa os iframes para aplicar o sandbox
    if (content) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      var iframes = tempDiv.querySelectorAll('iframe.allow-scripts-iframe');
      iframes.forEach(function(iframe) {
        iframe.setAttribute('sandbox', 'allow-scripts');
      });
      content = tempDiv.innerHTML;
    }

    // Extrai os src das imagens contidas no conteúdo
    var imageSrcs = [];
    if (content) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      var images = tempDiv.querySelectorAll('img');
      imageSrcs = Array.from(images).map(function(img) {
        return img.getAttribute("src");
      });
    }

    // Cria o objeto de dados para envio
    var dataToSend = {
      title: title,
      description: description,
      image: imageData,
      content: content,
      imagePages: imageSrcs, // array com os src das imagens do editor
      dir: directoryValue   // campo "dir" com o nome do diretório
    };

    // Envia os dados para o endpoint /post
    fetch('/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
    .then(function(response) {
  response.text().then(function(message) {
    if (response.ok) {
      alert(`Commit realizado com sucesso!\nCódigo: ${response.status}\nMensagem: ${message}`);
    } else {
      alert(`Erro ao enviar os dados.\nCódigo: ${response.status}`);
    }
  });
})

    .catch(function(error) {
      console.error('Erro:', error);
      alert('Erro ao enviar os dados.');
    });

  } else if (type === 'diretorio') {
    // Para "diretorio", envia apenas título, descrição, imagem e diretório
    var dataToSend = {
      title: title,
      description: description,
      image: imageData,
      dir: directoryValue
    };

    // Envia os dados para o endpoint /mkdir
    fetch('/mkdir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
    .then(function(response) {
      if (response.ok) {
        alert('Diretório criado com sucesso!');
      } else {
        alert('Erro ao criar diretório.');
      }
    })
    .catch(function(error) {
      console.error('Erro:', error);
      alert('Erro ao criar diretório.');
    });
  }
}

// Associa a função ao clique do botão commit
document.getElementById('commitButton').addEventListener('click', handleSubmit);



