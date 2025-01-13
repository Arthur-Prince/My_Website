package site.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pesquisas")
public class PesquisasController {

    @GetMapping("")
    public String pesquisas() {
        return "pesquisas"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/PRV")
    public String PRV() {
        return "PRV"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/SPH")
    public String SPH() {
        return "SPH"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
}
