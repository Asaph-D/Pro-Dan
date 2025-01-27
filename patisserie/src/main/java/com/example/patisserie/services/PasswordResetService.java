package com.example.patisserie.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.patisserie.models.PasswordResetToken;
import com.example.patisserie.models.Utilisateur;
import com.example.patisserie.repositories.PasswordResetTokenRepository;
import com.example.patisserie.repositories.UtilisateurRepository;

@Service
public class PasswordResetService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Envoie un token de réinitialisation de mot de passe à l'utilisateur.
     *
     * @param email L'email de l'utilisateur
     */
    public void sendResetToken(String email) {
        try {
            // Vérifiez si l'utilisateur existe
            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));
    
            // Générer un token unique
            String token = UUID.randomUUID().toString();
    
            // Créez et sauvegardez le token
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUtilisateur(utilisateur);
            resetToken.setExpirationDate(LocalDateTime.now().plusHours(1)); // Token valide 1 heure
            tokenRepository.save(resetToken);
    
            // Construire le lien de réinitialisation
            String resetLink = "http://localhost:8081/api/auth/reset-password?token=" + token;
    
            // Envoyer l'email de réinitialisation
            emailService.sendEmail(
                    email,
                    "Réinitialisation de votre mot de passe",
                    "Cliquez sur le lien suivant pour réinitialiser votre mot de passe : " + resetLink
            );
        } catch (RuntimeException e) {
            // Gérer les exceptions spécifiques
            throw new RuntimeException("Erreur lors de l'envoi de l'email de réinitialisation : " + e.getMessage(), e);
        } catch (Exception e) {
            // Gérer les exceptions génériques
            throw new RuntimeException("Erreur inattendue lors de l'envoi de l'email de réinitialisation : " + e.getMessage(), e);
        }
    }
    /**
     * Réinitialise le mot de passe d'un utilisateur.
     *
     * @param token       Le token de réinitialisation
     * @param newPassword Le nouveau mot de passe
     */
    public void resetPassword(String token, String newPassword) {
        // Vérifiez si le token existe et est valide
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide ou inexistant !"));

        // Vérifiez si le token a expiré
        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken); // Supprimez le token expiré
            throw new RuntimeException("Le token a expiré !");
        }

        // Mettre à jour le mot de passe de l'utilisateur
        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(utilisateur);

        // Supprimer le token après utilisation
        tokenRepository.delete(resetToken);
    }

    /**
     * Nettoie les tokens expirés dans la base de données.
     */
    public void cleanExpiredTokens() {
        tokenRepository.deleteByExpirationDateBefore(LocalDateTime.now());
    }
}
