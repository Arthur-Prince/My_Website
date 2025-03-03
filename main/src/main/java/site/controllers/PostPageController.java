package site.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import site.model.LinkDTO;
import site.model.PostPageDTO;
import site.services.PostPageService;

@Controller
public class PostPageController {

    @Autowired
    private PostPageService postPageService;
    
    @PostMapping("/post")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> postPage(@RequestBody PostPageDTO postPageDTO) {
        // Aqui você pode processar o DTO, por exemplo, salvar no banco ou executar alguma lógica.
        try {
	    postPageService.pageProcess(postPageDTO);
	} catch (IOException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
        return ResponseEntity.ok("Commit realizado com sucesso!");
    }
    
    @PostMapping("/mkdir")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> makeDir(@RequestBody LinkDTO linkDTO){
	try {
	    
	    linkDTO.setLink(postPageService.createLinkdir(linkDTO));
	    postPageService.createLink(linkDTO);
	} catch (IOException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	
	return ResponseEntity.ok("Commit realizado com sucesso!");
	
    }
}

