CKEDITOR.plugins.add('ChessIframe', {
    icons: 'chess', // Certifique-se de criar ou referenciar um ícone
    init: function(editor) {
        // Registra o comando que abre a dialog
        editor.addCommand('openChessIframe', new CKEDITOR.dialogCommand('ChessIframeDialog'));
       

        // Adiciona o botão na toolbar
        editor.ui.addButton('ChessIframe', {
            label: 'Inserir Chess Iframe',
            command: 'openChessIframe',
            toolbar: 'insert',
            icon: CKEDITOR.plugins.getPath('ChessIframe') + 'chess.png'
        });

        // Registra a dialog do plugin
        CKEDITOR.dialog.add('ChessIframeDialog', this.path + 'dialogs/ChessIframe.js');
    }
});