CKEDITOR.dialog.add('ChessIframeDialog', function(editor) {
    return {
        title: 'Chess Iframe',
        minWidth: 600,
        minHeight: 400,
        contents: [
            {
                id: 'iframeTab',
                label: 'Chess Iframe',
                elements: [
                    {
                        type: 'html',
                        // Adicionamos um id para podermos referenciar o iframe
                        html: '<iframe id="chessIframeInDialog" src="/outros/chess-editavel" style="width:100%; height:800px; border:0;"></iframe>'
                    }
                ]
            }
        ],
        onOk: function() {
            var dialog = this; // referência à dialog
            
            // Obtém o iframe da dialog
            var iframe = document.getElementById('chessIframeInDialog');
            if (!iframe) {
                alert('Iframe não encontrado.');
                return false;
            }
            
            // Tenta acessar o documento interno do iframe (funciona se estiver na mesma origem)
            var iframeDoc;
            try {
                iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            } catch (e) {
                alert('Erro ao acessar o conteúdo do iframe: ' + e);
                return false;
            }
            
            // Seleciona os elementos do formulário dentro do iframe
            // Certifique-se de que esses seletores correspondam ao HTML de /outros/chess-editavel
            var pgnTextElem = iframeDoc.querySelector('.pgn-form .pgn-text'); // textarea com a PGN
            var chessTitleElem = iframeDoc.querySelector('#chess-title'); // título
            
            if (!pgnTextElem || !chessTitleElem) {
                alert('Não foi possível localizar os elementos do formulário.');
                return false;
            }
            
            // Obtém os valores dos campos
            var pgn = pgnTextElem.value;
            var titulo = chessTitleElem.textContent.trim();
            // Gera um ID aleatório entre 0 e MAX_INT (2.147.483.647)
			var maxInt = 2147483647;
			var randomId = Math.floor(Math.random() * (maxInt + 1));
			
			// Constrói a URL de requisição GET com os parâmetros (encodeURIComponent garante que os valores sejam seguros)
			var url = '/outros/chess?shortcutKeysEnabled=false&titulo=' 
			          + encodeURIComponent(titulo) 
			          + '&pgn=' 
			          + encodeURIComponent(pgn);
			
			// Cria um novo iframe que carregará a página retornada pelo GET e insere o ID gerado
			var newIframeHtml = '<iframe name="iframe-' + randomId + '" id="' + randomId + '" src="' + url + '" style="width:100%; height:500px; border:0;" class="allow-scripts-iframe"></iframe>';
			
			// Insere o novo iframe no conteúdo do editor
			editor.insertHtml(newIframeHtml);
            
            // Fecha a dialog
            dialog.hide();
            
            // Retorna false para impedir o fechamento automático (já tratamos o fechamento)
            return false;
        }
    };
});
