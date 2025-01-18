package site.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import site.model.ContatoMsgDTO;
import site.repositorys.EmailMessageRepository;

import java.util.List;

@Service
public class BatchEmailService {

    @Autowired
    private EmailMessageRepository emailMessageRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Envia um resumo diário das mensagens às 8h da manhã.
     * Cron Expression: "0 0 8 * * ?" significa todos os dias às 8:00 AM.
     */
    @Scheduled(cron = "0 0/30 * * * ?")
    public void enviarResumoDiario() {
        List<ContatoMsgDTO> mensagens = emailMessageRepository.obterMensagens();

        if (!mensagens.isEmpty()) {
            emailService.enviarResumo(mensagens);
        }
        
        emailMessageRepository.clear();
    }
}

