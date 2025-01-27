package com.example.patisserie.controllers;

import com.example.patisserie.models.Produit;
import com.example.patisserie.services.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/produits")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    // Ajouter un produit avec une image
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Produit> addProduit(
            @RequestParam("nom") String nom,
            @RequestParam("prix") double prix,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("file") MultipartFile file) throws IOException {
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            return ResponseEntity.badRequest().body(null);
        }
        Produit produit = new Produit();
        produit.setNom(nom);
        produit.setPrix(prix);
        produit.setDescription(description);
        produit.setCategory(category);
        Produit newProduit = produitService.addProduit(produit, file);
        return ResponseEntity.ok(newProduit);
    }

    // Récupérer tous les produits
    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return ResponseEntity.ok(produits);
    }

    // Récupérer un produit par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable Long id) {
        Produit produit = produitService.getProduitById(id);
        return ResponseEntity.ok(produit);
    }

    // Mettre à jour un produit
@PutMapping(value = "/{id}", consumes = "multipart/form-data")
public ResponseEntity<Produit> updateProduit(
        @PathVariable Long id,
        @RequestParam("nom") String nom,
        @RequestParam("prix") double prix,
        @RequestParam("description") String description,
        @RequestParam("category") String category,
        @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

    Produit produit = produitService.getProduitById(id);
    produit.setNom(nom);
    produit.setPrix(prix);
    produit.setDescription(description);
    produit.setCategory(category);

    if (file != null && !file.isEmpty()) {
        String categoryFolder = produit.getCategory();
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get("public/images/" + categoryFolder + "/" + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        produit.setImage("/images/" + categoryFolder + "/" + fileName);
    }

    Produit updatedProduit = produitService.updateProduit(id, produit);
    return ResponseEntity.ok(updatedProduit);
}


    // Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.ok("Produit supprimé avec succès !");
    }

    // Rechercher des produits par nom (avec pagination)
    @GetMapping("/search")
    public ResponseEntity<List<Produit>> searchProduits(
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size) {
        List<Produit> produits = produitService.searchProduits(keyword, page, size);
        return ResponseEntity.ok(produits);
    }

    // Obtenir les statistiques (les produits les plus commandés)
    @GetMapping("/statistiques")
    public ResponseEntity<List<Produit>> getTopProduits() {
        List<Produit> produits = produitService.getTopProduits();
        return ResponseEntity.ok(produits);
    }

    @GetMapping("/produits/top")
    public List<Produit> getProduitsLesPlusCommandes(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produitService.getProduitsLesPlusCommandes(pageable);
    }
}
