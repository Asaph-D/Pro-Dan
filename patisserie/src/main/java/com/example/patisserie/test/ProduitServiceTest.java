package com.example.patisserie.test;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.example.patisserie.models.Produit;
import com.example.patisserie.services.ProduitService;

@SpringBootTest
public class ProduitServiceTest {

    @Autowired
    private ProduitService produitService;

    @Test
    public void testGetProduitsLesPlusCommandes() {
        Pageable pageable = PageRequest.of(0, 5);
        List<Produit> topProduits = produitService.getProduitsLesPlusCommandes(pageable);
        assertNotNull(topProduits);
                assertFalse(topProduits.isEmpty());
                    }
                
                    private void assertNotNull(List<Produit> topProduits) {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'assertNotNull'");
            }
        
                    private void assertFalse(boolean empty) {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'assertFalse'");
            }
}

