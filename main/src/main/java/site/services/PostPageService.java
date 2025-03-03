package site.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import site.model.LinkDTO;
import site.model.PostPageDTO;

@Service
public class PostPageService {

    @Autowired
    private S3Service s3;
    
    private static final String webdir = "website/";
    
    public void pageProcess(PostPageDTO postPage) throws IOException {
	    // Listas para armazenar os nomes de arquivo extraídos e os nomes modificados
	    List<String> originalFileNames = new ArrayList<>();
	    List<String> newFileNames = new ArrayList<>();

	    // Processa cada URL na lista imagePages
	    if (postPage.getImagePages() != null) {
	        for (String url : postPage.getImagePages()) {
	            
	            // Procura a parte depois de "filename="
	            int idx = url.indexOf("fileName=");
	            if (idx != -1) {
	                // Extrai o que vem após "filename="
	                String filePart = url.substring(idx + "fileName=".length());
	                originalFileNames.add(filePart);
	                // Se o filePart começar com "temp/", substitui por "website/{dir}/"
	                if (filePart.startsWith("temp/")) {
	                    String newFile = filePart.replaceFirst("temp/", webdir + postPage.getDir() + "/");
	                    newFileNames.add(newFile);
	                } else {
	                    newFileNames.add(filePart);
	                }
	            }
	        }
	    }

	    // Atualiza o conteúdo (campo content) do DTO:
	    // Para cada nome de arquivo original, substitui no conteúdo por seu correspondente modificado.
	    String content = postPage.getContent();
	    if (content != null) {
	        for (int i = 0; i < originalFileNames.size(); i++) {
	            String original = originalFileNames.get(i);
	            String novo = newFileNames.get(i);
	            // Usa Pattern.quote para tratar caracteres especiais
	            content = content.replaceAll(Pattern.quote(original), novo);
	        }
	        postPage.setContent(content);
	    }
	    
	    
	    // operações no s3
	    
	    // salva content como titulo.html
	    s3.uploadFile(postPage.getTitle()+".html", content.getBytes(), webdir + postPage.getDir());
	    
	    // renomeia os arquivos no s3 dos temp/ para website/dir
	    for (int i = 0; i < newFileNames.size(); i++) {
		s3.renameS3Object(originalFileNames.get(i), newFileNames.get(i));
	    }
	    LinkDTO link = new LinkDTO();
	    link.setDir(postPage.getDir());
	    link.setDescription(postPage.getDescription());
	    link.setTitle(postPage.getTitle());
	    link.setImage(postPage.getImage());
	    link.setLink(webdir + postPage.getDir()+"/"+postPage.getTitle()+".html");
	    link.setDeleteList(newFileNames);
	    
	    createLink(link);
	    
	}
    
    public void createLink(LinkDTO link) throws IOException {
	
	String url = link.getImage();
	
	// Procura a parte depois de "filename="
        int idx = url.indexOf("fileName=");
        if (idx != -1) {
            // Extrai o que vem após "filename="
            String filePart = url.substring(idx + "fileName=".length());
            // Se o filePart começar com "temp/", substitui por "website/{dir}/"
            if (filePart.startsWith("temp/")) {
                String newFile = filePart.replaceFirst("temp/", webdir + link.getDir() + "/");
                s3.renameS3Object(filePart,newFile);
                link.setImage(url.replaceFirst(filePart, newFile));

            }
        }

	ObjectMapper mapper = new ObjectMapper();
	// Converte o objeto para uma string JSON
	String json = mapper.writeValueAsString(link);
	
	
	s3.uploadFile(link.getTitle()+".link", json.getBytes(), webdir + link.getDir());
	
    }
    
    public String createLinkdir(LinkDTO link) {
	String rtn = webdir + link.getDir() + link.getTitle() + "/";
	System.out.println(rtn);
	return rtn;
    }
}
