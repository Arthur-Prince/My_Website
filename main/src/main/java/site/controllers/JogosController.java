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
@RequestMapping("/jogos")
public class JogosController {

    @Autowired
    CreatePageService createPageService;

    @GetMapping("")
    public String jogos(Model model, Authentication authentication) {
	String path = "website/jogos/";

	model.addAttribute("links", createPageService.buildDirPage(path));

	boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
		.anyMatch(role -> role.equals("ROLE_USER"));
	model.addAttribute("isUser", isUser);
	return "jogos"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }

    @GetMapping("/best-mate-chess")
    public String bestMateChess() {
	return "best-mate-chess";
    }
}
