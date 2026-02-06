package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Service for sending email notifications.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@ecommerce.com}")
    private String fromEmail;

    @Value("${app.name:E-Commerce Platform}")
    private String appName;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send order confirmation email.
     */
    @Async
    public void sendOrderConfirmation(Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Order Confirmation - Order #" + order.getOrderId());
            helper.setText(buildOrderConfirmationHtml(order), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            // Log error and send simple text email as fallback
            sendSimpleOrderConfirmation(order);
        }
    }

    /**
     * Send simple text order confirmation as fallback.
     */
    private void sendSimpleOrderConfirmation(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(order.getUser().getEmail());
            message.setSubject("Order Confirmation - Order #" + order.getOrderId());
            message.setText(buildOrderConfirmationText(order));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Build HTML content for order confirmation email.
     */
    private String buildOrderConfirmationHtml(Order order) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.US);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy HH:mm");

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head><style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background-color: #007bff; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 20px; background-color: #f9f9f9; }");
        html.append(".order-details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }");
        html.append("table { width: 100%; border-collapse: collapse; }");
        html.append("th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }");
        html.append("th { background-color: #f5f5f5; }");
        html.append(".total { font-size: 18px; font-weight: bold; color: #007bff; }");
        html.append(".footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }");
        html.append("</style></head><body>");

        html.append("<div class='container'>");

        // Header
        html.append("<div class='header'>");
        html.append("<h1>").append(appName).append("</h1>");
        html.append("<h2>Order Confirmation</h2>");
        html.append("</div>");

        // Content
        html.append("<div class='content'>");
        html.append("<p>Dear ").append(order.getUser().getName()).append(",</p>");
        html.append("<p>Thank you for your order! We're pleased to confirm that your order has been received.</p>");

        // Order details
        html.append("<div class='order-details'>");
        html.append("<h3>Order Details</h3>");
        html.append("<p><strong>Order Number:</strong> #").append(order.getOrderId()).append("</p>");
        html.append("<p><strong>Order Date:</strong> ").append(order.getCreatedAt().format(dateFormatter)).append("</p>");
        html.append("<p><strong>Status:</strong> ").append(order.getStatus()).append("</p>");
        html.append("</div>");

        // Items table
        html.append("<div class='order-details'>");
        html.append("<h3>Items Ordered</h3>");
        html.append("<table>");
        html.append("<tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>");

        for (OrderItem item : order.getItems()) {
            html.append("<tr>");
            html.append("<td>").append(item.getProduct().getName()).append("</td>");
            html.append("<td>").append(item.getQuantity()).append("</td>");
            html.append("<td>").append(currencyFormat.format(item.getPrice())).append("</td>");
            html.append("<td>").append(currencyFormat.format(item.getSubtotal())).append("</td>");
            html.append("</tr>");
        }

        html.append("<tr><td colspan='3' class='total'>Total</td>");
        html.append("<td class='total'>").append(currencyFormat.format(order.getTotalAmount())).append("</td></tr>");
        html.append("</table>");
        html.append("</div>");

        // Shipping address
        html.append("<div class='order-details'>");
        html.append("<h3>Shipping Address</h3>");
        html.append("<p>").append(order.getShippingAddress()).append("</p>");
        html.append("</div>");

        html.append("<p>We'll send you another email when your order ships.</p>");
        html.append("<p>If you have any questions, please contact our support team.</p>");
        html.append("</div>");

        // Footer
        html.append("<div class='footer'>");
        html.append("<p>This is an automated message. Please do not reply to this email.</p>");
        html.append("<p>&copy; 2019 ").append(appName).append(". All rights reserved.</p>");
        html.append("</div>");

        html.append("</div></body></html>");

        return html.toString();
    }

    /**
     * Build plain text content for order confirmation email.
     */
    private String buildOrderConfirmationText(Order order) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.US);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy HH:mm");

        StringBuilder text = new StringBuilder();
        text.append(appName).append(" - Order Confirmation\n");
        text.append("=".repeat(50)).append("\n\n");

        text.append("Dear ").append(order.getUser().getName()).append(",\n\n");
        text.append("Thank you for your order! We're pleased to confirm that your order has been received.\n\n");

        text.append("ORDER DETAILS\n");
        text.append("-".repeat(30)).append("\n");
        text.append("Order Number: #").append(order.getOrderId()).append("\n");
        text.append("Order Date: ").append(order.getCreatedAt().format(dateFormatter)).append("\n");
        text.append("Status: ").append(order.getStatus()).append("\n\n");

        text.append("ITEMS ORDERED\n");
        text.append("-".repeat(30)).append("\n");

        for (OrderItem item : order.getItems()) {
            text.append(item.getProduct().getName());
            text.append(" x ").append(item.getQuantity());
            text.append(" @ ").append(currencyFormat.format(item.getPrice()));
            text.append(" = ").append(currencyFormat.format(item.getSubtotal()));
            text.append("\n");
        }

        text.append("\nTotal: ").append(currencyFormat.format(order.getTotalAmount())).append("\n\n");

        text.append("SHIPPING ADDRESS\n");
        text.append("-".repeat(30)).append("\n");
        text.append(order.getShippingAddress()).append("\n\n");

        text.append("We'll send you another email when your order ships.\n\n");
        text.append("Thank you for shopping with us!\n\n");
        text.append("-".repeat(50)).append("\n");
        text.append("This is an automated message. Please do not reply.\n");

        return text.toString();
    }

    /**
     * Send generic notification email.
     */
    public void sendNotification(String to, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
}
