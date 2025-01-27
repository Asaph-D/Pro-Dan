package com.example.patisserie.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Produit product;

    private Integer quantity;
    private Double price;

    @ManyToOne
    private Payment payment;
}
