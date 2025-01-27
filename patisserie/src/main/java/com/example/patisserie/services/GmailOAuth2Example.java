package com.example.patisserie.services;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

public class GmailOAuth2Example {

    public static void main(String[] args) throws GeneralSecurityException, IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(new ByteArrayInputStream("your-service-account-key.json".getBytes()))
                .createScoped(Collections.singletonList(GmailScopes.GMAIL_SEND));
        credentials.refreshIfExpired();
        String accessToken = credentials.getAccessToken().getTokenValue();
        System.out.println("Access Token: " + accessToken);
    }
}
