package com.example.patisserie.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.patisserie.dto.LoginRequest;
import com.example.patisserie.dto.RegisterRequest;
import com.example.patisserie.dto.VerifyAdminRequest;
import com.example.patisserie.models.JwtResponse;
import com.example.patisserie.models.Role;
import com.example.patisserie.models.Utilisateur;
import com.example.patisserie.security.JwtUtils;
import com.example.patisserie.services.EmailService;
import com.example.patisserie.services.UtilisateurService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurService utilisateurService;
    private EmailService emailService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtUtils.validateToken(token)) {
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(401).body("Invalid token");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        utilisateurService.registerPatisserie(request);
        return ResponseEntity.ok("Utilisateur enregistré avec succès !");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authentifier et générer le token
            String token = utilisateurService.authenticate(request);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (RuntimeException e) {
            // Gérer les erreurs d'authentification
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        List<Utilisateur> users = utilisateurService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/get-user")
    public ResponseEntity<?> getUser(@RequestParam String email) {
        Optional<Utilisateur> user = utilisateurService.getUserByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable !");
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestParam String email, @RequestBody Utilisateur updatedUser) {
        try {
            utilisateurService.updateUser(email, updatedUser);
            return ResponseEntity.ok("Utilisateur mis à jour avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser(@RequestParam String email) {
        try {
            utilisateurService.deleteUser(email);
            return ResponseEntity.ok("Utilisateur supprimé avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/get-user-role")
    public ResponseEntity<?> getUserRole(@RequestParam String email) {
        try {
            Set<Role> roles = utilisateurService.getUserRoles(email);
            return ResponseEntity.ok(roles);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/social-register")
    public ResponseEntity<?> socialRegister(@RequestBody RegisterRequest request) {
        try {
            // Additional validation for social registration
            if (request.getProvider() == null || request.getProvider().isEmpty()) {
                return ResponseEntity.badRequest().body("Provider information is required");
            }
            
            // Register the user
            utilisateurService.registerSocialUser(request);
            
            // Send confirmation email
            String confirmationToken = UUID.randomUUID().toString();
            emailService.sendConfirmationEmail(request.getEmail(), confirmationToken);
            
            return ResponseEntity.ok("Utilisateur enregistré avec succès ! Veuillez vérifier votre email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/assign-role")
    public ResponseEntity<String> assignRoleToUser(@RequestParam Long userId, @RequestParam String roleName) {
        utilisateurService.assignRoleToUser(userId, roleName);
        return ResponseEntity.ok("Rôle assigné avec succès !");
    }

    // Révoquer un rôle d'un utilisateur
    @PostMapping("/revoke-role")
    public ResponseEntity<String> revokeRoleFromUser(@RequestParam Long userId, @RequestParam String roleName) {
        utilisateurService.revokeRoleFromUser(userId, roleName);
        return ResponseEntity.ok("Rôle révoqué avec succès !");
    }
    @PostMapping("/verify-admin")
    public ResponseEntity<?> verifyAdminPassword(@RequestBody VerifyAdminRequest request) {
        try {
            boolean verify = utilisateurService.verifyAdminPassword(request);
        System.out.println("from controller "+ verify);
            
            if (verify) {
                // Return success response
                return ResponseEntity.ok()
                .body(Map.of(
                    "verified", true,
                    "message", "Admin verification successful"
                ));
            }
            return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body("Invalid password");
    
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during verification: " + e.getMessage());
        }
    }
}