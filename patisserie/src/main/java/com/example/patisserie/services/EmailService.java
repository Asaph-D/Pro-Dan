package com.example.patisserie.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    public void sendConfirmationEmail(String to, String confirmationToken) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context(Locale.FRENCH);
            context.setVariable("confirmationUrl",
                frontendUrl + "/confirm-email?token=" + confirmationToken);
            context.setVariable("userName", to.split("@")[0]); // Simple way to get name from email

            String htmlContent = templateEngine.process("confirmation-email", context);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Confirmez votre compte Pâtisserie");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email de confirmation : ", e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email de confirmation", e);
        }
    }

    public void sendSocialLoginConfirmation(String to, String provider) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context(Locale.FRENCH);
            context.setVariable("provider", provider);
            context.setVariable("userName", to.split("@")[0]);
            context.setVariable("loginUrl", frontendUrl + "/login");

            String htmlContent = templateEngine.process("social-login-confirmation", context);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Bienvenue sur Pâtisserie - Compte " + provider);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email de confirmation de connexion sociale : ", e);
            throw new RuntimeException("Erreur lors de l'envoi de l'email de confirmation de connexion sociale", e);
        }
    }

    public void sendDeliveryReceipt(String toEmail, String receiptNumber, Double amount, String deliveryAddress) {
        try {
            Context context = new Context();
            context.setVariables(createDeliveryReceiptContext(receiptNumber, amount, deliveryAddress));

            String emailContent = templateEngine.process("delivery-receipt", context);
            sendHtmlEmail(toEmail, "Your Order Confirmation - " + receiptNumber, emailContent);

        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi du reçu de livraison : ", e);
            throw new RuntimeException("Erreur lors de l'envoi du reçu de livraison: " + e.getMessage(), e);
        }
    }

    public void sendOrderNotification(String chefEmail, String receiptNumber,
                                    List<Map<String, Object>> orderDetails, String deliveryAddress) {
        try {
            Context context = new Context();
            context.setVariables(createOrderNotificationContext(receiptNumber, orderDetails, deliveryAddress));

            String emailContent = templateEngine.process("order-notification", context);
            sendHtmlEmail(chefEmail, "New Order Notification - " + receiptNumber, emailContent);

        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de la notification de commande : ", e);
            throw new RuntimeException("Erreur lors de l'envoi de la notification de commande: " + e.getMessage(), e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private Map<String, Object> createDeliveryReceiptContext(String receiptNumber, Double amount, String deliveryAddress) {
        Map<String, Object> context = new HashMap<>();
        context.put("receiptNumber", receiptNumber);
        context.put("amount", String.format("%.2f €", amount));
        context.put("deliveryAddress", deliveryAddress);
        context.put("frontendUrl", frontendUrl);
        return context;
    }

    private Map<String, Object> createOrderNotificationContext(String receiptNumber,
                                                             List<Map<String, Object>> orderDetails,
                                                             String deliveryAddress) {
        Map<String, Object> context = new HashMap<>();
        context.put("receiptNumber", receiptNumber);
        context.put("orderDetails", orderDetails);
        context.put("deliveryAddress", deliveryAddress);
        return context;
    }
}
