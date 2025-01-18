package site.controllers;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/portfolio")
public class PortfolioController {

    @GetMapping("")
    public String portfolio() {
        return "portfolio"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadCurriculo() {
	
        try {
            // Caminho para o arquivo
            Path filePath = Paths.get("src/main/resources/static/pdfs/curriculo.pdf").toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
                
            }

            // Configuração dos headers para download
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"curriculo.pdf\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
