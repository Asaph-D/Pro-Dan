package com.example.patisserie.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import javax.management.relation.RoleNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.patisserie.dto.LoginRequest;
import com.example.patisserie.dto.RegisterRequest;
import com.example.patisserie.dto.VerifyAdminRequest;
import com.example.patisserie.models.Role;
import com.example.patisserie.models.RoleName;
import com.example.patisserie.models.Utilisateur;
import com.example.patisserie.repositories.RoleRepository;
import com.example.patisserie.repositories.UtilisateurRepository;
import com.example.patisserie.security.JwtUtils;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    public String authenticate(LoginRequest request) {
        // Trouver l'utilisateur par email
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect !"));

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect !");
        }

        // Générer le token JWT
        return jwtUtils.generateToken(utilisateur.getEmail());
    }

    public boolean verifyAdminPassword(VerifyAdminRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new RuntimeException("does not exist"));
        // Verify if user has admin role
        boolean isAdmin = user.getRoles()
        .stream()
        .anyMatch(role -> role.getName() == RoleName.ADMIN);
  
        if (!isAdmin) {
            return false;
        }
        System.out.println("from service: pass "+ passwordEncoder.matches(request.getPassword(), user.getMotDePasse()));
        // System.out.println("from service: role "+ isAdmin);
        // Use your existing passwordEncoder to verify the password
        return passwordEncoder.matches(request.getPassword(), user.getMotDePasse());
    }
    
    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }
    
    public class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }
    
    public class RoleNotFoundException extends RuntimeException {
        public RoleNotFoundException(String message) {
            super(message);
        }
    }

    public class SocialLoginException extends RuntimeException {
        public SocialLoginException(String message) {
            super(message);
        }
    }

    private String generateConfirmationToken() {
        return UUID.randomUUID().toString();
    }

    public Optional<Utilisateur> getUserByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    public void registerPatisserie(RegisterRequest request) {
        // Vérifiez si l'utilisateur existe déjà
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("L'utilisateur avec cet email existe déjà !");
        }

        // Créez un nouvel utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setAdresse(request.getAdresse());
        utilisateur.setTelephone(request.getTelephone());

        // Attribuez le rôle USER par défaut
        Role roleUser = roleRepository.findByName(RoleName.USER)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleName.USER);
                    return roleRepository.save(newRole);
                });
        utilisateur.getRoles().add(roleUser);

        // Sauvegardez l'utilisateur
        utilisateurRepository.save(utilisateur);
    }

    public void registerSocialUser(RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Un compte avec cet email existe déjà !");
        }

        // Valider le fournisseur social
        if (request.getProvider() == null || request.getProvider().isEmpty()) {
            throw new SocialLoginException("Le fournisseur d'authentification sociale est requis !");
        }

        // Créer un nouvel utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setEmail(request.getEmail());
        // Générer un mot de passe aléatoire pour les comptes sociaux
        String randomPassword = UUID.randomUUID().toString();
        utilisateur.setMotDePasse(passwordEncoder.encode(randomPassword));
        utilisateur.setProvider(request.getProvider());
        utilisateur.setProviderId(request.getProviderId());

        // Optionnel: définir d'autres champs si fournis
        if (request.getAdresse() != null) {
            utilisateur.setAdresse(request.getAdresse());
        }
        if (request.getTelephone() != null) {
            utilisateur.setTelephone(request.getTelephone());
        }

        // Attribuer le rôle USER par défaut
        Role roleUser = roleRepository.findByName(RoleName.USER)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleName.USER);
                    return roleRepository.save(newRole);
                });
        utilisateur.getRoles().add(roleUser);

        // Sauvegarder l'utilisateur
        Utilisateur savedUser = utilisateurRepository.save(utilisateur);

        // Envoyer l'email de confirmation
        String confirmationToken = generateConfirmationToken();
        emailService.sendConfirmationEmail(savedUser.getEmail(), confirmationToken);
    }
    // Assigner un rôle à un utilisateur
    public void assignRoleToUser(Long userId, String roleName) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle introuvable !"));
        utilisateur.getRoles().add(role);
        utilisateurRepository.save(utilisateur);
    }

    // Révoquer un rôle d'un utilisateur
    public void revokeRoleFromUser(Long userId, String roleName) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rôle introuvable !"));
        utilisateur.getRoles().remove(role);
        utilisateurRepository.save(utilisateur);
    }

    public void updateUser(String email, Utilisateur updatedUser) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));

        // Update user fields
        user.setNom(updatedUser.getNom());
        user.setAdresse(updatedUser.getAdresse());
        user.setTelephone(updatedUser.getTelephone());

        // Update roles
        user.getRoles().clear();
        for (Role role : updatedUser.getRoles()) {
            Role existingRole = roleRepository.findByName(role.getName())
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName(role.getName());
                        return roleRepository.save(newRole);
                    });
            user.getRoles().add(existingRole);
        }

        // Save changes
        utilisateurRepository.save(user);
    }

    public void deleteUser(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));

        utilisateurRepository.delete(user);
    }

    public Set<Role> getUserRoles(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));

        return user.getRoles();
    }

    public Utilisateur findByProviderAndProviderId(String provider, String providerId) {
        return utilisateurRepository.findByProviderAndProviderId(provider, providerId)
                .orElse(null);
    }

    public void confirmEmail(String token) {
        // Implement email confirmation logic
        // This would typically involve finding a user by confirmation token
        // and setting their email as verified
        Utilisateur user = utilisateurRepository.findByConfirmationToken(token)
                .orElseThrow(() -> new RuntimeException("Token de confirmation invalide !"));
        
        user.setEmailVerified(true);
        user.setConfirmationToken(null);
        utilisateurRepository.save(user);
    }
}