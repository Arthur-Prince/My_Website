package site.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import site.services.S3Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }
    
    @GetMapping
    public String getPage(Model model) {
	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    boolean hasUserRole = auth.getAuthorities().stream()
	                              .anyMatch(authority -> authority.getAuthority().equals("ROLE_USER"));
	    model.addAttribute("hasUserRole", hasUserRole);
        return "s3";
    }

    @PostMapping("/file")
    @PreAuthorize("hasRole('USER') or (#dir == 'temp')")
    public ResponseEntity<?> uploadFile(
            @RequestParam("upload") MultipartFile file,
            @RequestParam(value = "dir", defaultValue = "", required = false) String dir,
            @RequestParam(value = "responseType", required = false) String response) {
	try {
            // Realiza o upload e recebe a URL do arquivo enviado.
            // Supondo que s3Service.uploadFile retorne uma String com a URL do arquivo.
            String fileUrl = s3Service.uploadFile(file, dir);
            String fileName = file.getOriginalFilename();

            // Cria o JSON de resposta para sucesso
            Map<String, Object> jsonResponse = new HashMap<>();
            jsonResponse.put("uploaded", 1);
            jsonResponse.put("fileName", fileName);
            jsonResponse.put("url", fileUrl);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonResponse);
        } catch (Exception e) {
            // Cria o JSON de resposta para erro
            Map<String, Object> errorResponse = new HashMap<>();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao enviar arquivo: " + e.getMessage());
            errorResponse.put("uploaded", 0);
            errorResponse.put("error", error);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorResponse);
        }
    }


    @DeleteMapping("/file")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> deleteFile(@RequestParam("fileName") String fileName) {
        try {
            s3Service.deleteFile(fileName);
            return ResponseEntity.ok("Arquivo deletado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro ao deletar arquivo: " + e.getMessage());
        }
    }
    
    // Endpoint para download de arquivo
    @GetMapping("/file")
    @PreAuthorize("hasRole('USER') or (#fileName.startsWith('temp') or #fileName.startsWith('website'))")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("fileName") String fileName) {
        try {
            byte[] data = s3Service.downloadFile(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/list")
    @PreAuthorize("hasRole('USER') or (#dir == 'temp' or #dir == 'website')")
    public ResponseEntity<List<String>> listFiles(@RequestParam(value = "dir", defaultValue = "", required = false) String dir) {
        try {
            List<String> files = s3Service.listFiles(dir);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
