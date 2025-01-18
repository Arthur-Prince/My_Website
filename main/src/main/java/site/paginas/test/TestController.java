package site.paginas.test;

import java.util.LinkedList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import site.model.Shader;

@Controller
@RequestMapping("/test")
public class TestController {

	@GetMapping()
	public String test() {
        return "test";
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
	
	@GetMapping("/shaders2")
	public ResponseEntity<String> t(){
		return ResponseEntity.ok("test");
	}
}
