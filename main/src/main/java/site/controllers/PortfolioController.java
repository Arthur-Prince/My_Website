package site.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/portfolio")
public class PortfolioController {

    @GetMapping("")
    public String portfolio() {
        return "portfolio"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
}
