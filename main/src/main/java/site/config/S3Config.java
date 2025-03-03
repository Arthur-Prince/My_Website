package site.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Configuration
public class S3Config {

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretAccessKey}")
    private String secretAccessKey;

    @Value("${aws.region}")
    private String region;
    
    @Value("${aws.s3.bucketName}")
    private String bucketName;

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        S3Client rtn =S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
        
        checkBucketAccess(bucketName, rtn);
        return rtn;
    }
    
    public boolean checkBucketAccess(String bucketName, S3Client s3Client) {
	    try {
	        HeadBucketRequest headBucketRequest = HeadBucketRequest.builder()
	                .bucket(bucketName)
	                .build();
	        s3Client.headBucket(headBucketRequest);
	        System.out.println("Acesso ao bucket " + bucketName + " verificado com sucesso.");
	        return true;
	    } catch (S3Exception e) {
	        System.err.println("Erro ao acessar o bucket " + bucketName + ": " + e.awsErrorDetails().errorMessage());
	        return false;
	    }
	}
}

