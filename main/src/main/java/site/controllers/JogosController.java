package site.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/jogos")
public class JogosController {

    @GetMapping("")
    public String jogos() {
        return "jogos"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/best-mate-chess")
    public String bestMateChess() {
        return "best-mate-chess";
    }
}
