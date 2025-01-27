package com.example.patisserie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequest {

    @NotBlank(message = "Le nom est obligatoire.")
    @Size(min = 2, max = 50, message = "Le nom doit comporter entre 2 et 50 caractères.")
    private String nom;

    @NotBlank(message = "L'email est obligatoire.")
    @Email(message = "Veuillez fournir une adresse e-mail valide.")
    private String email;

    // Required for traditional registration, optional for social
    @Size(min = 6, message = "Le mot de passe doit comporter au moins 6 caractères.")
    private String motDePasse;
    
    private String adresse;
    private String telephone;
    
    // Optional social login fields
    private String provider;
    private String providerId;
    
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
    
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    // Helper method to check if this is a social login request
    public boolean isSocialLogin() {
        return provider != null && !provider.isEmpty() && 
               providerId != null && !providerId.isEmpty();
    }

    // Helper method to validate the request based on registration type
    public void validate() throws IllegalArgumentException {
        if (isSocialLogin()) {
            // For social login, we don't require password
            if (motDePasse != null && !motDePasse.isEmpty()) {
                throw new IllegalArgumentException("Le mot de passe ne doit pas être fourni pour une connexion sociale");
            }
        } else {
            // For traditional registration, we require password
            if (motDePasse == null || motDePasse.isEmpty()) {
                throw new IllegalArgumentException("Le mot de passe est obligatoire pour une inscription traditionnelle");
            }
        }
    }
}