package site.filters;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import site.services.JwtService;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        // 1. Tenta obter o token de um cookie
        String token = getTokenFromCookies(request.getCookies(), "JWT-TOKEN");

        // 2. Se não houver token ou estiver vazio, gera um token anônimo
        if (token == null || token.isEmpty()) {
            String anonymousToken = jwtService.generateToken("anonymousUser", "ANONYMOUS");
            addTokenCookie(response, "JWT-TOKEN", anonymousToken);
            SecurityContextHolder.getContext().setAuthentication(
                getAuthentication("anonymousUser", "ROLE_ANONYMOUS")
            );
        } else {
            try {
                // 3. Validar token
                Claims claims = jwtService.getClaims(token);
                String username = claims.getSubject();
                String role = (String) claims.get("role");

                // 4. Se o token for válido, setar no contexto
                SecurityContextHolder.getContext().setAuthentication(
                    getAuthentication(username, "ROLE_" + role)
                );
            } catch (Exception e) {
                // Token expirado/inválido -> gera token anônimo
                String anonymousToken = jwtService.generateToken("anonymousUser", "ANONYMOUS");
                addTokenCookie(response, "JWT-TOKEN", anonymousToken);
                
            }
        }

        // Segue o fluxo
        filterChain.doFilter(request, response);
    }

    /**
     * Tenta recuperar o token de um array de cookies, procurando pelo nome especificado.
     */
    private String getTokenFromCookies(Cookie[] cookies, String cookieName) {
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (cookieName.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    /**
     * Adiciona um cookie com o token JWT, configurando opções básicas de segurança.
     */
    private void addTokenCookie(HttpServletResponse response, String cookieName, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true); // Evita acesso via JavaScript
        cookie.setPath("/");      // Disponível em toda a aplicação
        cookie.setMaxAge(86400);  // Opcional: tempo de vida em segundos (1 dia)
        // cookie.setSecure(true); // Ativar se estiver usando HTTPS
        response.addCookie(cookie);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String username, String role) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));
        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }
}
