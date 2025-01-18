package site.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContatoMsgDTO {

    String nome;
    String assunto;
    String message;
    
    /**
     * Converte a mensagem em uma representação HTML personalizada.
     *
     * @return String contendo a mensagem formatada em HTML.
     */
    public String toHtmlString() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style=\"margin-bottom: 20px;\">")
          .append("<h3 style=\"color: #2E86C1;\">").append(assunto).append("</h3>")
          .append("<p><strong>Nome:</strong> ").append(nome).append("</p>")
          .append("<p><strong>Mensagem:</strong></p>")
          .append("<p>").append(message).append("</p>")
          .append("<hr style=\"border: none; border-top: 1px solid #ccc;\" />")
          .append("</div>");
        return sb.toString();
    }
}
