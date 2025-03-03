package site.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import site.model.LinkDTO;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
	this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file, String dir) throws IOException {
	int random = (int) (Math.random() * 90000) + 10000;
	String key = (dir + "/" + random + "-" + file.getOriginalFilename());
	PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(key).build();
	s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
	return "/s3/file?fileName=" + key;
    }

    public String uploadFile(String fileName, byte[] content, String dir) throws IOException {

	String key = (dir + "/" + fileName);
	PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(key).build();

	ByteArrayInputStream inputStream = new ByteArrayInputStream(content);
	s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, content.length));

	return "/s3/file?fileName=" + key;
    }

    @CacheEvict(value = "downloadFile", key = "#fileName")
    public void deleteFile(String fileName) {
	DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder().bucket(bucketName).key(fileName)
		.build();
	s3Client.deleteObject(deleteObjectRequest);
    }

    @CacheEvict(value = "downloadFile", allEntries = true)
    public void deleteDirectory(String directoryName) {
	// Garante que o parâmetro termine com "/" para representar um diretório
	if (!directoryName.endsWith("/")) {
	    throw new IllegalArgumentException("O nome do diretório deve terminar com '/'");
	}

	// Lista todos os objetos que possuem o prefixo (diretório)
	ListObjectsV2Request listRequest = ListObjectsV2Request.builder().bucket(bucketName).prefix(directoryName)
		.build();

	ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
	for (S3Object s3Object : listResponse.contents()) {
	    // Chama a função que deleta um arquivo individualmente
	    deleteFile(s3Object.key());
	}
    }

    @Cacheable(value = "downloadFile", key = "#fileName")
    public byte[] downloadFile(String fileName) {
	GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(fileName).build();
	ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
	return objectBytes.asByteArray();
    }

    public List<LinkDTO> downloadAllLinkFiles(String directoryPath) {
	List<LinkDTO> arquivos = new LinkedList<>();
	ObjectMapper objectMapper = new ObjectMapper();

	// Utiliza delimiter para não retornar objetos de subdiretórios
	ListObjectsV2Request listRequest = ListObjectsV2Request.builder().bucket(bucketName).prefix(directoryPath)
		.delimiter("/").build();

	ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
	for (S3Object s3Object : listResponse.contents()) {
	    String key = s3Object.key();
	    // Verifica se o arquivo termina com .link
	    if (key.endsWith(".link")) {
		byte[] conteudoBytes = downloadFile(key);
		// Converte os bytes para String usando UTF-8
		String jsonContent = new String(conteudoBytes, StandardCharsets.UTF_8);
		try {
		    // Converte o JSON para o objeto LinkDTO
		    LinkDTO linkDTO = objectMapper.readValue(jsonContent, LinkDTO.class);
		    arquivos.add(linkDTO);
		} catch (Exception e) {
		    // Trate a exceção de acordo com sua necessidade, ex: log, throw, etc.
		    e.printStackTrace();
		}
	    }
	}
	return arquivos;
    }

    public void renameS3Object(String oldKey, String newKey) {
	// Copia o objeto para o novo nome (newKey)
	CopyObjectRequest copyReq = CopyObjectRequest.builder().copySource(bucketName + "/" + oldKey)
		.destinationBucket(bucketName).destinationKey(newKey).build();
	s3Client.copyObject(copyReq);

	// Remove o objeto com o nome antigo (oldKey)
	deleteFile(oldKey);
    }

    public List<String> listFiles(String prefix) {
	ListObjectsV2Request listReq = ListObjectsV2Request.builder().bucket(bucketName).prefix(prefix).build();
	ListObjectsV2Response listRes = s3Client.listObjectsV2(listReq);

	return listRes.contents().stream().map(S3Object -> S3Object.key().replaceFirst("^" + prefix + "/", ""))
		.collect(Collectors.toList());
    }
}
