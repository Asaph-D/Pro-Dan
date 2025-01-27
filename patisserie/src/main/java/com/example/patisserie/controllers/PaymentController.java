package com.example.patisserie.controllers;

import com.example.patisserie.models.Payment;
import com.example.patisserie.services.PaymentService;
import com.example.patisserie.services.EmailService;
import com.example.patisserie.dto.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/process/mobile")
    public ResponseEntity<?> processMobilePayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            String operator = paymentRequest.getOperator();
            String phoneNumber = paymentRequest.getPhoneNumber();
            Double amount = paymentRequest.getAmount(); // Ensure amount is correctly parsed as Double

            Payment payment = paymentService.processMobilePayment(operator, phoneNumber, amount);

            if (payment != null && payment.isSuccessful()) {
                String receiptNumber = generateReceiptNumber();

                emailService.sendDeliveryReceipt(
                    payment.getCustomerEmail(),
                    receiptNumber,
                    payment.getAmount(),
                    payment.getDeliveryAddress()
                );

                emailService.sendOrderNotification(
                    "kouokamasaph142@gmail.com",
                    receiptNumber,
                    payment.getOrderDetails(),
                    payment.getDeliveryAddress()
                );

                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment processed successfully",
                    "receiptNumber", receiptNumber
                ));
            }

            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment processing failed"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/process/card")
    public ResponseEntity<?> processCardPayment(@RequestBody Map<String, Object> paymentRequest) {
        try {
            Payment payment = paymentService.processCardPayment(paymentRequest);

            if (payment != null && payment.isSuccessful()) {
                String receiptNumber = generateReceiptNumber();

                emailService.sendDeliveryReceipt(
                    payment.getCustomerEmail(),
                    receiptNumber,
                    payment.getAmount(),
                    payment.getDeliveryAddress()
                );

                emailService.sendOrderNotification(
                    "kouokamasaph142@gmail.com",
                    receiptNumber,
                    payment.getOrderDetails(),
                    payment.getDeliveryAddress()
                );

                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment processed successfully",
                    "receiptNumber", receiptNumber
                ));
            }

            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Payment processing failed"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    private String generateReceiptNumber() {
        return "REC-" + System.currentTimeMillis();
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}
