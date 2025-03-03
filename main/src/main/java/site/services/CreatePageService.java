package site.services;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import site.model.LinkDTO;

@Service
public class CreatePageService {
    
    @Autowired
    S3Service s3;

    public String buildHTMLPage(String path) {
	
	String htmlContent = new String(s3.downloadFile(path), StandardCharsets.UTF_8);
	
	
	return htmlContent;
    }
    
    public List<LinkDTO> buildDirPage(String path) {
	
	
	return s3.downloadAllLinkFiles(path);
    }
    
    public void deleteLink(String path) {
	s3.deleteFile(path+".link");
    }
}
