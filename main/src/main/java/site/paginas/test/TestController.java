package site.paginas.test;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import site.model.Shader;

@Controller
@RequestMapping("/test")
@PreAuthorize("hasRole('USER')")
public class TestController {

    @GetMapping()
    public String test(Model model) {
	// model.addAttribute("pgn", msg);
	List<String> iframeUrls = Arrays.asList("/outros/diploma", "/iframes/chess.html");

	// Se preferir, você pode criar uma lista de objetos com mais informações, se
	// necessário.
	model.addAttribute("iframeUrls", iframeUrls);
	return "test";
    }

    @GetMapping("/shaders")
    public ResponseEntity<List<Shader>> getJsonShaders() {
	List<Shader> shaders = new LinkedList<Shader>();
	shaders.add(new Shader("shaders/VertexShader.vs", "vs"));
	shaders.add(new Shader("shaders/BufferA.fs", "fs"));
	shaders.add(new Shader("shaders/BufferB.fs", "fs"));
	shaders.add(new Shader("shaders/BufferC.fs", "fs"));
	shaders.add(new Shader("shaders/common.fs", "fs"));
	shaders.add(new Shader("shaders/image.fs", "fs"));

	return ResponseEntity.ok(shaders);
    }

    @GetMapping("/shaders2")
    public ResponseEntity<String> t() {
	return ResponseEntity.ok("test");
    }
}
