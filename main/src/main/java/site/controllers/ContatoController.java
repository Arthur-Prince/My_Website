package site.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import site.model.ContatoMsgDTO;
import site.model.Message;
import site.repositorys.EmailMessageRepository;
import site.services.EmailService;

@Controller
@RequestMapping("/contato")
public class ContatoController {
    
    @Autowired
    private EmailMessageRepository emailMessageRepository;
    
    @Autowired
    private EmailService emailService;

    @GetMapping("")
    public String contato() {
        return "contato"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @PostMapping("/msg")
    public ResponseEntity<Message> receberMensagem(@RequestBody ContatoMsgDTO mensagemDTO) {
        if ("sendall".equalsIgnoreCase(mensagemDTO.getNome())) {
            // Coletar todas as mensagens atuais
            List<ContatoMsgDTO> mensagens = emailMessageRepository.obterMensagens();

            if (!mensagens.isEmpty()) {
                // Enviar o resumo imediatamente
                emailService.enviarResumo(mensagens);
                
                emailMessageRepository.clear();
                return ResponseEntity.ok(new Message("Resumo das mensagens enviado com sucesso!"));
            } else {
                return ResponseEntity.ok(new Message("Não há mensagens para enviar."));
            }
        } else {
            // Adicionar a mensagem à lista
            emailMessageRepository.adicionarMensagem(mensagemDTO);
            return ResponseEntity.ok(new Message("Mensagem recebida com sucesso!"));
        }
    }
}
