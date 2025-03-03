package site.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import site.services.CreatePageService;

@Controller
@RequestMapping("/pesquisas")
public class PesquisasController {
    
    @Autowired
    CreatePageService createPageService;

    @GetMapping("")
    public String pesquisas(Model model, Authentication authentication) {
	String path = "website/pesquisas/";

	model.addAttribute("links", createPageService.buildDirPage(path));

	boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
		.anyMatch(role -> role.equals("ROLE_USER"));
	model.addAttribute("isUser", isUser);
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
