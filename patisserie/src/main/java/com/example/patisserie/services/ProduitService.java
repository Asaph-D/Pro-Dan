package com.example.patisserie.services;

import com.example.patisserie.models.Produit;
import com.example.patisserie.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    // Ajouter un produit avec une image
    public Produit addProduit(Produit produit, MultipartFile file) throws IOException {
        String categoryFolder = produit.getCategory();
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get("public/images/" + categoryFolder + "/" + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        produit.setImage("/images/" + categoryFolder + "/" + fileName);
        return produitRepository.save(produit);
    }

    // Récupérer tous les produits
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    // Récupérer un produit par ID
    public Produit getProduitById(Long id) {
        Optional<Produit> produit = produitRepository.findById(id);
        return produit.orElseThrow(() -> new RuntimeException("Produit introuvable !"));
    }

    // Mettre à jour un produit
    public Produit updateProduit(Long id, Produit produitDetails) {
        Produit produit = getProduitById(id);
        produit.setNom(produitDetails.getNom());
        produit.setPrix(produitDetails.getPrix());
        produit.setImage(produitDetails.getImage());
        produit.setDescription(produitDetails.getDescription());
        produit.setCompteurCommandes(produitDetails.getCompteurCommandes());
        return produitRepository.save(produit);
    }

    // Supprimer un produit
    public void deleteProduit(Long id) {
        produitRepository.deleteById(id);
    }

    // Rechercher des produits par nom (avec pagination)
    public List<Produit> searchProduits(String keyword, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return produitRepository.findByNomContainingIgnoreCase(keyword, pageable).getContent();
    }

    // Obtenir les produits les plus commandés
    public List<Produit> getTopProduits() {
        List<Produit> produits = produitRepository.findAll();
        return produits.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getCompteurCommandes(), p1.getCompteurCommandes()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Produit> getProduitsLesPlusCommandes(Pageable pageable) {
        return produitRepository.findProduitsLesPlusCommandes(pageable);
    }
}
