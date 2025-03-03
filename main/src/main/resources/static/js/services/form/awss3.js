let currentDirectory = document.getElementById("all")? "all":"temp";
    let currentPage = 1;
    const maxItemsPerPage = 12;

    // Função para buscar a lista de arquivos conforme o diretório selecionado
    function fetchFileList() {
      let endpoint = "s3/list";
      if (currentDirectory !== "all") {
        endpoint += "?dir=" + currentDirectory;
      }
      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          renderFileList(data);
        })
        .catch(error => console.error("Erro ao buscar arquivos:", error));
    }

    // Renderiza a lista de arquivos com paginação
    function renderFileList(files) {
      const fileListDiv = document.getElementById("fileList");
      fileListDiv.innerHTML = "";

      const totalPages = Math.ceil(files.length / maxItemsPerPage);
      const start = (currentPage - 1) * maxItemsPerPage;
      const end = start + maxItemsPerPage;
      const pageFiles = files.slice(start, end);

      pageFiles.forEach(file => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.textContent = file;
        
        let endpoint = "s3/file?fileName=";
      
	      if (currentDirectory !== "all") {
	        endpoint += currentDirectory+"/";
	      }

        // Botão de Download
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.onclick = function() {
          window.location.href = endpoint + encodeURIComponent(file);
        };
        
        div.appendChild(downloadBtn);

        // Botão de Delete
        if (typeof hasUserRole !== "undefined" && hasUserRole) {
	        const deleteBtn = document.createElement("button");
	        deleteBtn.textContent = "Delete";
	        deleteBtn.onclick = function() {
	          fetch(endpoint + encodeURIComponent(file), { method: "DELETE" })
	            .then(response => {
	              if (response.ok) {
	                fetchFileList();
	              } else {
	                alert("Erro ao deletar arquivo.");
	              }
	            });
	        };
			div.appendChild(deleteBtn);
		}

        
        fileListDiv.appendChild(div);
      });

      renderPagination(totalPages);
    }

    // Renderiza botões de paginação, se necessário
    function renderPagination(totalPages) {
      const paginationDiv = document.getElementById("pagination");
      paginationDiv.innerHTML = "";
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          btn.onclick = function() {
            currentPage = i;
            fetchFileList();
          };
          paginationDiv.appendChild(btn);
        }
      }
    }

    // Atualiza a lista quando clica no botão update
    document.getElementById("updateBtn").onclick = function() {
      currentPage = 1;
      fetchFileList();
    };

    // Atualiza o diretório selecionado e busca a lista ao mudar a opção
    document.querySelectorAll("input[name='directory']").forEach(radio => {
      radio.addEventListener("change", function() {
        currentDirectory = this.value;
        currentPage = 1;
        fetchFileList();
      });
    });

    // Upload de arquivo
    const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.onclick = function() {
    const fileInput = document.getElementById("uploadInput");
    if (fileInput.files.length === 0) {
      alert("Selecione um arquivo para upload.");
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    let endpoint = "s3/file";
    
    if (currentDirectory !== "all") {
      endpoint += "?dir=" + currentDirectory;
    }
    formData.append("upload", file);
    fetch(endpoint, {
      method: "POST",
      body: formData
    }).then(response => {
      if (response.ok) {
        alert("Upload realizado com sucesso!");
        fetchFileList();
      } else {
        alert("Erro no upload do arquivo.");
      }
    });
  };
}


    // Carrega a lista inicial
    fetchFileList();