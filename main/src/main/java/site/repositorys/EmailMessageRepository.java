package site.repositorys;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import site.model.ContatoMsgDTO;

@Component
public class EmailMessageRepository {
    private static EmailMessageRepository instance;
    private List<ContatoMsgDTO> mensagens;

    private EmailMessageRepository() {
        mensagens = new ArrayList<>();
    }

    public static synchronized EmailMessageRepository getInstance() {
        if (instance == null) {
            instance = new EmailMessageRepository();
        }
        return instance;
    }

    public synchronized void adicionarMensagem(ContatoMsgDTO mensagem) {
        mensagens.add(mensagem);
    }

    public synchronized boolean clear() {
        
        mensagens.clear();
        return true;
    }

    public synchronized List<ContatoMsgDTO> obterMensagens() {
        return new ArrayList<>(mensagens);
    }
}
