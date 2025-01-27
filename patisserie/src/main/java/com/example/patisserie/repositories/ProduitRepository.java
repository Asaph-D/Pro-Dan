package com.example.patisserie.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.patisserie.models.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    @Query("SELECT p FROM Produit p ORDER BY p.compteurCommandes DESC")
    List<Produit> findProduitsLesPlusCommandes();
    
    @Query("SELECT p FROM Produit p ORDER BY p.compteurCommandes DESC")
    List<Produit> findProduitsLesPlusCommandes(Pageable pageable);

    // Page<Produit> findAll(Pageable pageable);

    @Query("SELECT p FROM Produit p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Produit> rechercherProduits(@Param("nom") String nom);

    // Rechercher des produits par nom (ignore la casse) avec pagination
    Page<Produit> findByNomContainingIgnoreCase(String keyword, Pageable pageable);
    // Pageable pageable = PageRequest.of(0, 10); // Page 1, avec 10 éléments par page.
    // Page<Produit> result = produitRepository.findByNomContainingIgnoreCase("chocolat", pageable);
    // List<Produit> produits = result.getContent(); // Récupération des éléments.

    @Query("SELECT p.nom, SUM(p.prix * p.compteurCommandes) FROM Produit p GROUP BY p.nom")
    List<Object[]> getRevenusParProduit();
    
    @Query("SELECT SUM(p.prix * p.compteurCommandes) FROM Produit p")
    Double getRevenusTotaux();

}
