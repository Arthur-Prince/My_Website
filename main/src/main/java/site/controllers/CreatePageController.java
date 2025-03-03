package site.controllers;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.util.UriUtils;

import jakarta.servlet.http.HttpServletRequest;
import site.services.CreatePageService;

@Controller
@RequestMapping("/website")
public class CreatePageController {

    @Autowired
    CreatePageService createPageService;

    @RequestMapping(value = "/**", method = RequestMethod.GET)
    public String createPage(HttpServletRequest request, Model model, Authentication authentication) {

	String path = ((String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE))
		.substring(1);
	String decodedPath = UriUtils.decode(path, StandardCharsets.UTF_8);

	if (decodedPath.charAt(decodedPath.length() - 1) != '/') {

	    String htmlContent = createPageService.buildHTMLPage(decodedPath);

	    model.addAttribute("conteudo", htmlContent);
	    return "content";
	}else {
	    
	    model.addAttribute("links", createPageService.buildDirPage(decodedPath));
	    
	    boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
			.anyMatch(role -> role.equals("ROLE_USER"));
		model.addAttribute("isUser", isUser);
	    return "content";
	}

    }
    
    @PreAuthorize("hasRole('USER')")
    @RequestMapping(value = "/**", method = RequestMethod.DELETE)
    public ResponseEntity<String> makeDir(HttpServletRequest request){
	
	String path = ((String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE))
		.substring(1);
	String decodedPath = UriUtils.decode(path, StandardCharsets.UTF_8);
	
	createPageService.deleteLink(decodedPath);
	
	return ResponseEntity.noContent().build();
    }
}
