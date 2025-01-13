package site.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class HomeController {

    @GetMapping("")
    public String home() {
        return "home"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
}
