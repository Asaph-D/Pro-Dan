package com.example.patisserie.services;

import com.example.patisserie.models.Payment;
import com.example.patisserie.repositories.PaymentRepository;
import com.example.patisserie.services.EmailService;
import com.example.patisserie.exceptions.PaymentProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${orange.api.key}")
    private String orangeApiKey;

    @Value("${mtn.api.key}")
    private String mtnApiKey;

    @Value("${orange.api.url}")
    private String orangeApiUrl;

    @Value("${mtn.api.url}")
    private String mtnApiUrl;

    @Transactional
    public Payment processMobilePayment(String operator, String phoneNumber, Double amount) {
        validateMobilePayment(operator, phoneNumber);
    
        Payment payment = new Payment();
        payment.setPaymentMethod("MOBILE_MONEY");
        payment.setOperator(operator);
        payment.setPhoneNumber(phoneNumber);
        payment.setAmount(amount);
        payment.setStatus("PENDING");
    
        try {
            boolean verified = initiateMobileTransfer(operator, phoneNumber, amount);
    
            if (verified) {
                payment.setStatus("COMPLETED");
                payment.setReceiptNumber(generateReceiptNumber());
            } else {
                payment.setStatus("FAILED");
                throw new PaymentProcessingException("Mobile money transfer verification failed");
            }
    
            return paymentRepository.save(payment);
        } catch (Exception e) {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new PaymentProcessingException("Mobile money payment processing failed: " + e.getMessage());
        }
    }
    
    private boolean initiateMobileTransfer(String operator, String phoneNumber, Double amount) {
        String apiUrl = operator.equalsIgnoreCase("ORANGE") ? orangeApiUrl : mtnApiUrl;
        String apiKey = operator.equalsIgnoreCase("ORANGE") ? orangeApiKey : mtnApiKey;
    
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + apiKey);
    
        Map<String, Object> requestBody = Map.of(
            "phoneNumber", phoneNumber,
            "amount", amount
        );
    
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
    
        ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, Map.class);
    
        if (response.getStatusCode().is2xxSuccessful()) {
            return (boolean) response.getBody().get("initiated");
        } else {
            throw new PaymentProcessingException("Failed to initiate mobile transfer: " + response.getBody().get("message"));
        }
    }
    

    @Transactional
    public Payment processCardPayment(Map<String, Object> paymentDetails) {
        Payment payment = new Payment();
        payment.setPaymentMethod("BANK_CARD");
        payment.setAmount((Double) paymentDetails.get("amount"));
        payment.setStatus("PENDING");

        try {
            boolean processed = processWithPaymentGateway(paymentDetails);

            if (processed) {
                payment.setStatus("COMPLETED");
                payment.setReceiptNumber(generateReceiptNumber());
            } else {
                payment.setStatus("FAILED");
                throw new PaymentProcessingException("Bank card payment processing failed");
            }

            return paymentRepository.save(payment);
        } catch (Exception e) {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new PaymentProcessingException("Bank card payment processing failed: " + e.getMessage());
        }
    }

    private void validateMobilePayment(String operator, String phoneNumber) {
        if (operator == null || operator.trim().isEmpty()) {
            throw new PaymentProcessingException("Operator is required");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new PaymentProcessingException("Phone number is required");
        }
        if (!operator.equalsIgnoreCase("ORANGE") && !operator.equalsIgnoreCase("MTN")) {
            throw new PaymentProcessingException("Invalid operator");
        }
    }

    // private boolean initiateMobileTransfer(String operator, String phoneNumber, Double amount) {
    //     String apiUrl = operator.equalsIgnoreCase("ORANGE") ? orangeApiUrl : mtnApiUrl;
    //     String apiKey = operator.equalsIgnoreCase("ORANGE") ? orangeApiKey : mtnApiKey;

    //     HttpHeaders headers = new HttpHeaders();
    //     headers.set("Content-Type", "application/json");
    //     headers.set("Authorization", "Bearer " + apiKey);

    //     Map<String, Object> requestBody = Map.of(
    //         "phoneNumber", phoneNumber,
    //         "amount", amount
    //     );

    //     HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

    //     ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, Map.class);

    //     if (response.getStatusCode().is2xxSuccessful()) {
    //         return (boolean) response.getBody().get("initiated");
    //     } else {
    //         throw new PaymentProcessingException("Failed to initiate mobile transfer: " + response.getBody().get("message"));
    //     }
    // }

    private boolean processWithPaymentGateway(Map<String, Object> paymentDetails) {
        String apiUrl = "https://api.paypal.com/v1/payments/payment";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer YOUR_PAYPAL_API_KEY");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(paymentDetails, headers);

        ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return (boolean) response.getBody().get("approved");
        } else {
            throw new PaymentProcessingException("Failed to process payment with gateway: " + response.getBody().get("message"));
        }
    }

    private String generateReceiptNumber() {
        return "REC-" + System.currentTimeMillis();
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentHistory(Long customerId) {
        return paymentRepository.findByCustomerIdOrderByPaymentDateDesc(customerId);
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByReceiptNumber(String receiptNumber) {
        return paymentRepository.findByReceiptNumber(receiptNumber)
            .orElseThrow(() -> new PaymentProcessingException("Payment not found"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
