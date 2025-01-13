package site.controllers;

import java.util.LinkedList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;

import site.paginas.test.Shader;

@Controller
@RequestMapping("/outros")
public class OutrosController {
    
    
    @GetMapping("")
    public String outros() {
        return "outros"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/diploma")
    public String diploma(Model model) {
	model.addAttribute("pdfUrl", "/pdfs/diploma.pdf");
        return "diploma"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    
    @GetMapping("/shaders")
	public ResponseEntity<List<Shader>> getJsonShaders(){
		List<Shader> shaders = new LinkedList<Shader>();
		shaders.add(new Shader("shaders/VertexShader.vs","vs"));
		shaders.add(new Shader("shaders/BufferA.fs","fs"));
		shaders.add(new Shader("shaders/BufferB.fs","fs"));
		shaders.add(new Shader("shaders/BufferC.fs","fs"));
		shaders.add(new Shader("shaders/common.fs","fs"));
		shaders.add(new Shader("shaders/image.fs","fs"));
		
		return ResponseEntity.ok(shaders);
	}

}
