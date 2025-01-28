package site.services;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret; // Ideal é deixar em config segura
    
    String jti = UUID.randomUUID().toString();

    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 86400000); // 1 dia, por exemplo

        return Jwts.builder()
                .setSubject(username)
                .setId(jti)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, secret.getBytes())
                .compact();
    }

    public Claims getClaims(String token) throws ExpiredJwtException {
        return Jwts.parser()
                .setSigningKey(secret.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }
    
    public String getRoleFromToken(String token) {
        Claims claims = getClaims(token);
        // Se no payload do JWT você tem algo como "role": "USER"
        return (String) claims.get("role");
    }

    public String getUsernameFromToken(String token) {
        Claims claims = getClaims(token);
        // Se no payload você guarda o nome no "sub" ou "username"
        return claims.getSubject(); // "sub" por padrão, mas depende de como você criou
    }
}
