package site.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import site.model.ContatoMsgDTO;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private final String destinatario = "r2.arthur.prince@gmail.com"; // E-mail que receberá as mensagens

    /**
     * Envia um e-mail com uma lista de mensagens.
     *
     * @param mensagens Lista de mensagens a serem enviadas.
     */
    /**
     * Envia um e-mail com um resumo das mensagens recebidas.
     *
     * @param mensagens Lista de mensagens a serem enviadas.
     */
    public void enviarResumo(List<ContatoMsgDTO> mensagens) {
        if (mensagens == null || mensagens.isEmpty()) {
            return; // Nada para enviar
        }

        // Cria o MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            // Define o helper para facilitar a criação do e-mail
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(destinatario);
            helper.setSubject("Resumo Diário de Mensagens Recebidas");
            helper.setFrom("seuemail@gmail.com"); // Opcional: definir o remetente

            // Construir o corpo do e-mail em HTML
            StringBuilder corpoEmail = new StringBuilder();
            corpoEmail.append("<html><body>")
                      .append("<h2>Resumo Diário de Mensagens Recebidas</h2>")
                      .append("<p>Você recebeu <strong>").append(mensagens.size()).append("</strong> mensagem(ns) hoje:</p>");

            // Itera sobre as mensagens e adiciona ao corpo do e-mail
            for (ContatoMsgDTO msg : mensagens) {
                corpoEmail.append(msg.toHtmlString());
            }

            corpoEmail.append("</body></html>");

            // Define o conteúdo do e-mail como HTML
            helper.setText(corpoEmail.toString(), true);

            // Envia o e-mail
            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            // Trate a exceção conforme necessário (logging, rethrow, etc.)
            e.printStackTrace();
        }
    }
}
