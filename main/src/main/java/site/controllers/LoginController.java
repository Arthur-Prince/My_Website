package site.controllers;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import site.model.LoginDTO;
import site.services.JwtService;

@Controller
public class LoginController {

    @Value("${auth.username}")
    private String adminUser;

    @Value("${auth.userpassword}")
    private String adminPasswordEncoded;
    
    
    @Autowired
    private JwtService jwtService;

    // 1) GET /login -> Exibe a página de login
    @GetMapping("/login")
    public String showLoginForm() {
	// Retorna o nome do seu template Thymeleaf ou HTML.
	// Ex: "login.html"
	return "login";
    }

    // 2) POST /login -> Processa manualmente (usuário=fb, senha=fb)
    @PostMapping("/logar")
    public String processLogin(
        @RequestParam("username") String username,
        @RequestParam("password") String password,
        HttpServletResponse response
    ) {
        // Decodifica do Base64 (ex.: "adm" e "adm123"), compara etc.
        String adminPassword = new String(Base64.getDecoder().decode(adminPasswordEncoded), StandardCharsets.UTF_8);

        if (adminUser.equals(username) && adminPassword.equals(password)) {
        

         // Se user e pass estiverem corretos:
            String jwtToken = jwtService.generateToken(username, "USER");

            // Add cookie com token
            Cookie cookie = new Cookie("JWT-TOKEN", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 1 dia, ex.
            // cookie.setSecure(true); // se estiver usando HTTPS

            response.addCookie(cookie);

            return "redirect:/home";
        } else {
            // erro
            return "redirect:/login?error";
        }
    }
    
    @GetMapping("/deslogar")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. Obter o token do cookie
        String jwtToken = getJwtTokenFromCookies(request);

        // 2. Se existir, checa a role
        if (jwtToken != null) {
            try {
                String role = jwtService.getRoleFromToken(jwtToken);

                if ("USER".equals(role)) {
                    // 3. Gera um novo token (se for a sua necessidade)
                    //    por exemplo, token "ANONYMOUS" ou sem role
                    String newToken = jwtService.generateToken("anonymousUser", "ANONYMOUS");

                    // 4. Sobrescreve o cookie
                    addTokenCookie(response, "JWT-TOKEN", newToken);
                }

            } catch (Exception e) {
                // Se houver erro de validação do token, trata aqui
                // ou apenas ignora.
            }
        }

        // 5. Redireciona para algum lugar (ex: /home ou /login)
        return "redirect:/";
    }
    
    
    private String getJwtTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("JWT-TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }
        return null;
    }
    
    private void addTokenCookie(HttpServletResponse response, String cookieName, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true); // Evita acesso via JavaScript
        cookie.setPath("/");      // Disponível em toda a aplicação
        cookie.setMaxAge(86400);  // Opcional: tempo de vida em segundos (1 dia)
        // cookie.setSecure(true); // Ativar se estiver usando HTTPS
        response.addCookie(cookie);
    }

}
