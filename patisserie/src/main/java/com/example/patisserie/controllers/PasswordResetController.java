package com.example.patisserie.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.patisserie.dto.ResetPasswordRequest;
import com.example.patisserie.services.PasswordResetService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/reset-password-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "L'email est requis."));
            }
            passwordResetService.sendResetToken(email);
            return ResponseEntity.ok(Map.of("message", "Un email de réinitialisation a été envoyé !"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de l'envoi de l'email."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erreur lors de la réinitialisation du mot de passe."));
        }
    }
}
