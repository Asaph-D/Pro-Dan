package com.example.patisserie.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.patisserie.models.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    boolean existsByEmail(String email); // Vérifie l'existence par email
    Optional<Utilisateur> findByEmail(String email); // Récupère un utilisateur par email
    Optional<Utilisateur> findByProviderAndProviderId(String provider, String providerId);
    Optional<Utilisateur> findByConfirmationToken(String token);
}