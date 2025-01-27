package com.example.patisserie.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class AppConfig {

    @Value("${orange.api.key}")
    private String orangeApiKey;

    @Value("${mtn.api.key}")
    private String mtnApiKey;

    @Value("${orange.api.url}")
    private String orangeApiUrl;

    @Value("${mtn.api.url}")
    private String mtnApiUrl;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public String orangeApiKey() {
        return orangeApiKey;
    }

    @Bean
    public String mtnApiKey() {
        return mtnApiKey;
    }

    @Bean
    public String orangeApiUrl() {
        return orangeApiUrl;
    }

    @Bean
    public String mtnApiUrl() {
        return mtnApiUrl;
    }
}
