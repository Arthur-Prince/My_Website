package site.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import jakarta.annotation.PostConstruct;

@Configuration
@PropertySource("classpath:config/secrets.properties") // Caminho absoluto ou relativo ao arquivo
public class SecretsConfig {
    @Value("${spring.mail.username:Não configurado}")
    private String mailUsername;

    @PostConstruct
    public void logSecrets() {
        System.out.println("Propriedade carregada: spring.mail.username = " + mailUsername);
    }
}
