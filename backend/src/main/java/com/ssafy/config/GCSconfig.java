//ndk
package com.ssafy.config;

import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GCSconfig {
    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    @Bean
    public Bucket bucket(Storage storage){
        return storage.get(bucketName);
    }
}
