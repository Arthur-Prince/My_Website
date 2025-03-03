
  function deleteItem(endpoint) {
  
	if (endpoint.endsWith('.html')) {
	    endpoint = endpoint.slice(0, -5);
	  }else{ if (endpoint.endsWith('/')) {
	    endpoint = endpoint.slice(0, -1);
	  }
  	}
    fetch(endpoint, {
      method: 'DELETE'
    }).then(response => {
      if(response.ok) {
        // Opcional: remova o item da tela ou atualize a lista
        console.log('Item deletado com sucesso');
      } else {
        console.error('Erro ao deletar o item');
      }
    }).catch(error => console.error('Erro na requisição:', error));
  }
