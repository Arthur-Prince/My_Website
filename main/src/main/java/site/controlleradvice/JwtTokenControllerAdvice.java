package site.controlleradvice;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import site.services.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class JwtTokenControllerAdvice {

    @Autowired
    private JwtService jwtService; // Seu serviço que valida/extrai dados do token

    @ModelAttribute
    public void addJwtInfoToModel(HttpServletRequest request, Model model) {
        // 1. Pegar o cookie "JWT-TOKEN"
        String jwtToken = getJwtTokenFromCookie(request);

        // 2. Se existir, decodificar e validar
        if (jwtToken != null) {
            try {
                // Extrair role e username. Depende de como você gera o token!
                String role = jwtService.getRoleFromToken(jwtToken);
                String username = jwtService.getUsernameFromToken(jwtToken);

                // 3. Se tiver role e username, joga no Model
                //    para usar no Thymeleaf
                model.addAttribute("role", role);
                model.addAttribute("username", username);

            } catch (Exception e) {
                // Se der qualquer erro (token inválido, expiração etc.), 
                // você pode tratar aqui. Por exemplo, só não setar nada.
            }
        }
    }

    private String getJwtTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("JWT-TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }
}
