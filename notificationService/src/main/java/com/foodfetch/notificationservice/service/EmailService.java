package com.foodfetch.notificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    /**
     * Sends an HTML email notification
     *
     * @param to Recipient email address
     * @param subject Email subject
     * @param content Email content (plain text)
     */
    public void sendEmail(String to, String subject, String content) {
        try {
            logger.info("Preparing to send email to: {}", to);

            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("hello@demomailtrap.co");
            helper.setTo(to);
            helper.setSubject(subject);

            // Create an HTML version of the email with better formatting
            String htmlContent = createHtmlEmail(subject, content);
            helper.setText(htmlContent, true); // true indicates this is HTML

            emailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Creates an HTML email template
     */
    private String createHtmlEmail(String subject, String message) {
        // Extract event type from subject (e.g., "FoodFetch: order-confirmed" -> "order-confirmed")
        String eventType = subject.contains(":") ? subject.split(":")[1].trim() : subject;

        // Determine background color and icon based on event type
        String backgroundColor = "#3498db"; // Default blue
        String emoji = "🍔";

        if (eventType.contains("confirmed")) {
            backgroundColor = "#2ecc71"; // Green
            emoji = "✅";
        } else if (eventType.contains("preparation")) {
            backgroundColor = "#f39c12"; // Orange
            emoji = "👨‍🍳";
        } else if (eventType.contains("delivery") || eventType.contains("update")) {
            backgroundColor = "#3498db"; // Blue
            emoji = "🚚";
        } else if (eventType.contains("arrival")) {
            backgroundColor = "#9b59b6"; // Purple
            emoji = "🎉";
        }

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: " + backgroundColor + "; padding: 20px; color: white; text-align: center; border-radius: 5px 5px 0 0; }" +
                "        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }" +
                "        .logo { font-size: 24px; font-weight: bold; }" +
                "        .emoji { font-size: 48px; margin: 10px 0; }" +
                "        .message { margin: 20px 0; font-size: 16px; }" +
                "        .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }" +
                "        .button { display: inline-block; padding: 10px 20px; background-color: " + backgroundColor + "; color: white; " +
                "                 text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <div class='logo'>FoodFetch</div>" +
                "            <div class='emoji'>" + emoji + "</div>" +
                "            <h1>" + formatEventType(eventType) + "</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <div class='message'>" + message + "</div>" +
                "            <a href='http://localhost:5173/track-order/67e5f6c13a73626d0fe19fd7' class='button'>Track Your Order</a>" +
                "        </div>" +
                "        <div class='footer'>" +
                "            <p>This is an automated message from FoodFetch. Please do not reply to this email.</p>" +
                "            <p>&copy; " + java.time.Year.now().getValue() + " FoodFetch. All rights reserved.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Formats event type into a readable title
     */
    private String formatEventType(String eventType) {
        if (eventType == null || eventType.isEmpty()) {
            return "Order Update";
        }

        // Remove "order-" prefix if present
        String formatted = eventType.replace("order-", "");

        // Capitalize each word
        String[] words = formatted.split("[\\s-]+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (word.length() > 0) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }

        return result.toString().trim();
    }
}