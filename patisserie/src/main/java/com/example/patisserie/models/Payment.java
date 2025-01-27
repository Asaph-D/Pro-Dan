package com.example.patisserie.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentMethod; // MOBILE_MONEY, BANK_CARD
    private String operator; // For mobile money: ORANGE, MTN
    private String transferCode;
    private String phoneNumber;
    private Double amount;
    private String status; // PENDING, COMPLETED, FAILED
    private String receiptNumber;
    private LocalDateTime paymentDate;

    @ManyToOne
    private Utilisateur customer;

    private String customerEmail;
    private String deliveryAddress;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    private boolean successful;

    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
    }

    public boolean isSuccessful() {
        return "COMPLETED".equals(status);
    }

    public List<Map<String, Object>> getOrderDetails() {
        return orderItems.stream()
            .map(orderItem -> {
                Map<String, Object> details = Map.of(
                    "name", orderItem.getProduct().getNom(),
                    "quantity", orderItem.getQuantity(),
                    "price", orderItem.getPrice()
                );
                return details;
            })
            .collect(Collectors.toList());
    }
}
