package site.controllers;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;
import site.model.ChessIframeDTO;
import site.model.Shader;

import org.springframework.ui.Model;

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
    
    @GetMapping("/post")
    public String postPage(Model model) {
	
        
        // Se preferir, você pode criar uma lista de objetos com mais informações, se necessário.
        model.addAttribute("url", "/outros/chess-editavel");
        model.addAttribute("id", 1);
        return "post";
    }
    
    @GetMapping("/chess-editavel")
    public String editorDePGNIframe(Model model) {
	String msg = "\n"
		+ "[Event \"fbgh54rt's test: test\"]\n"
		+ "[Site \"https://lichess.org/study/qEHYOiF7/LnpPIFqS\"]\n"
		+ "[Result \"*\"]\n"
		+ "[Variant \"Standard\"]\n"
		+ "[ECO \"C58\"]\n"
		+ "[Opening \"Italian Game: Two Knights Defense, Polerio Defense, Bogoljubow Variation\"]\n"
		+ "[Annotator \"https://lichess.org/@/fbgh54rt\"]\n"
		+ "[StudyName \"fbgh54rt's test\"]\n"
		+ "[ChapterName \"test\"]\n"
		+ "[UTCDate \"2025.01.29\"]\n"
		+ "[UTCTime \"00:16:33\"]\n"
		+ "\n"
		+ "1. e4 e5 2. Nf3 Nc6 3. Bc4 { abertura italiana } 3... Nf6 { [%cal Gf3g5,Gc4f7] } 4. Ng5 (4. d3 { se não tirar o bispo ou jogar h6 Cg5 vira uma ameaça muito forte } { [%cal Gf8e7,Gf8c5,Gh7h6,Gf8d6,Gf3g5] } 4... d6 5. Ng5) 4... d5 5. exd5 Na5 6. Bb5+ (6. d3 { jogue lento no fim vc vai ter compensacao com espaco na ala do rei }) 6... c6 7. dxc6 bxc6 { [%cal Gd1f3,Gb5d3,Gb5e2] } 8. Qf3 (8. Be2 h6 9. Nf3 e4 10. Ng1 (10. Ne5 { esqueci o q tem aqui mas isso e teste } { [%cal Ge5g4,Gf8c5,Gd8d4] } 10... Bc5 (10... Qd4 11. Ng4 Nxg4 (11... Bxg4 12. Bxg4 Nxg4 13. Qxg4) 12. Bxg4 Bxg4 13. Qxg4) 11. O-O)) (8. Bd3 h6 (8... Nd5 9. Nf3 Bd6 10. O-O (10. Nc3 Nf4 11. O-O Nxd3 12. cxd3) 10... Nf4 11. Re1 Nxd3 12. cxd3 O-O) 9. Ne4 Nd5) (8. Ba4 Bc5) (8. b4 cxb5 9. bxa5) 8... Be7 (8... Rb8 9. Be2 Be7 10. Ne4 Nxe4 11. Qxe4 O-O) 9. O-O { fica esperto para nao levar mate em f7 } { [%cal Ge8g8,Gh7h6,Gf6d5,Gd5f4,Gf7f5] } (9. Bd3 O-O 10. Nc3 h6 11. Nge4 Nxe4 (11... Nd5 12. Ng3 Nb4 13. Nf5 Bg5 14. h4 Nxd3+ 15. cxd3 Be7) 12. Bxe4 Qd7) *\n"
		+ "\n"
		+ "";
	
	model.addAttribute("titulo", null);
	model.addAttribute("pgn", msg);
	return "fragments/iframes/chess-editavel"; // O Spring Boot procura por "home.html" em src/main/resources/templates/
    }
    
    @GetMapping("/chess")
    public String PGNIframe(@RequestParam("titulo") String titulo,
                            @RequestParam("pgn") String pgn,
                            @RequestParam(value = "shortcutKeysEnabled", required = false, defaultValue = "true") boolean shortcutKeysEnabled,
                            Model model,
                            HttpServletResponse response) {
	System.out.println(titulo);
	response.setHeader("Cache-Control", "public, max-age=86400");
        model.addAttribute("titulo", titulo);
        model.addAttribute("pgn", pgn);
        model.addAttribute("shortcutKeysEnabled", shortcutKeysEnabled);
        return "fragments/iframes/chess";
    }



}
