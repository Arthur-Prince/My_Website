package site.paginas.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import lombok.Data;

@Data
public class Shader {
	private String nome;
	private String conteudo;
	private String type;

	public Shader(String path,String type) {
		this.nome = path.substring(path.lastIndexOf('/')+1, path.lastIndexOf('.'));
		
		this.conteudo=readFileFromResources(path);
		this.type=type;
	}

	private String readFileFromResources(String fileName) {
		try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(fileName);
				BufferedReader reader = new BufferedReader(
						new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

			if (inputStream == null) {
				return "erro";
			}

			StringBuilder content = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				content.append(line).append("\n");
			}
			return content.toString();
		} catch (IOException e) {
			return "erro";
		}
	}

}
