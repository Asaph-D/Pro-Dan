package com.example.patisserie.repositories;

import com.example.patisserie.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerIdOrderByPaymentDateDesc(Long customerId);
    Optional<Payment> findByReceiptNumber(String receiptNumber);
}