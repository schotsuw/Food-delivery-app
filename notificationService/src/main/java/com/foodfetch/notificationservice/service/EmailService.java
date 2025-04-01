package com.foodfetch.notificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * EmailService is responsible for sending email notifications.
 * It uses JavaMailSender to send emails and formats the content as HTML.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    /**
     * JavaMailSender is used to send emails.
     */
    @Autowired
    private JavaMailSender emailSender;

    /**
     * Sends an email with the specified parameters.
     *
     * @param to      Recipient's email address
     * @param subject Email subject
     * @param content Email content
     * @param orderId The order ID (can be null)
     */
    public void sendEmail(String to, String subject, String content, String orderId) {
        try {
            logger.info("Preparing to send email to: {}", to);

            // Create a MimeMessage
            MimeMessage mimeMessage = emailSender.createMimeMessage();

            // Use MimeMessageHelper to set the email properties
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Set email properties
            helper.setFrom("noreply@foodfetch.com");
            helper.setTo(to);
            helper.setSubject(subject);

            // Create an HTML version of the email with better formatting
            String htmlContent = createHtmlEmail(subject, content, orderId);
            helper.setText(htmlContent, true); // true indicates this is HTML

            // Send the email
            emailSender.send(mimeMessage);
            logger.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Sends an email without an order ID
     * Overloaded method for convenience
     *
     * @param to      Recipient's email address
     * @param subject Email subject
     * @param content Email content
     */
    public void sendEmail(String to, String subject, String content) {
        sendEmail(to, subject, content, null);
    }

    /**
     * Creates an HTML email with a specific format based on the event type
     *
     * @param subject  Email subject
     * @param message  Email message
     * @param orderId  The order ID (can be null)
     * @return HTML formatted email content
     */
    private String createHtmlEmail(String subject, String message, String orderId) {
        // Extract event type from subject (e.g., "FoodFetch: order-confirmed" -> "order-confirmed")
        String eventType = subject.contains(":") ? subject.split(":")[1].trim() : subject;

        // Determine background color, icon, and enhanced message based on event type
        String backgroundColor = "#3498db"; // Default blue
        String emoji = "🛑";
        String enhancedMessage = message;

        if (eventType.contains("created")) {
            backgroundColor = "#e74c3c"; // Red
            emoji = "🍔";
            enhancedMessage = "Great choice! We've received your order" + (orderId != null ? " #" + orderId : "") +
                    " and are getting everything ready. You'll receive updates as your meal progresses through our kitchen to your doorstep!";
        }
        else if (eventType.contains("confirmed")) {
            backgroundColor = "#2ecc71"; // Green
            emoji = "✅";
            enhancedMessage = "Good news! Your order" + (orderId != null ? " #" + orderId : "") +
                    " has been confirmed and the restaurant is preparing to make your delicious meal. Get ready for a taste sensation!";
        }
        else if (eventType.contains("preparation")) {
            backgroundColor = "#f39c12"; // Orange
            emoji = "👨‍🍳";
            enhancedMessage = "The chefs are working their magic on your order" + (orderId != null ? " #" + orderId : "") +
                    ". Your mouthwatering meal is being prepared with care and will be ready for delivery soon!";
        }
        else if (eventType.contains("in-transit")) {
            backgroundColor = "#3498db"; // Blue
            emoji = "🚚";
            enhancedMessage = "Your food is on the way! Your order" + (orderId != null ? " #" + orderId : "") +
                    " is now with our delivery partner and will arrive at your doorstep shortly. Time to set the table!";
        }
        else if (eventType.contains("arrival")) {
            backgroundColor = "#9b59b6"; // Purple
            emoji = "🎉";
            enhancedMessage = "Bon appétit! Your order" + (orderId != null ? " #" + orderId : "") +
                    " has arrived at your location. Enjoy your delicious meal while it's hot!";
        }
        else if (eventType.contains("update")) {
            backgroundColor = "#3498db"; // Blue
            emoji = "📋";
            enhancedMessage = "We have an update about your order" + (orderId != null ? " #" + orderId : "") +
                    ". " + message;
        }
        else if(eventType.contains("cancelled")) {
            backgroundColor = "#e74c3c"; // Red
            emoji = "❌";
            enhancedMessage = "We're sorry to inform you that your order" + (orderId != null ? " #" + orderId : "") +
                    " has been cancelled. If you have any questions, please contact our support team.";
        }


        // Build the tracking URL with the actual orderId if available
        String trackingUrl = "http://localhost:5173/track-order/";
        if (orderId != null && !orderId.isEmpty()) {
            trackingUrl += orderId;
        }
        else {
            trackingUrl += "67e5f6c13a73626d0fe19fd7"; // Fallback ID
        }

        // Create the HTML content
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
                "        .message { margin: 20px 0; font-size: 16px; line-height: 1.8; }" +
                "        .order-id { font-weight: bold; margin-bottom: 15px; color: #555; }" +
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
                (orderId != null ? "            <div class='order-id'>Order ID: " + orderId + "</div>" : "") +
                "            <div class='message'>" + enhancedMessage + "</div>" +
                "            <a href='" + trackingUrl + "' class='button'>Track Your Order</a>" +
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
     * Formats the event type for display
     *
     * @param eventType The event type string
     * @return Formatted event type string
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

        // Capitalize the first letter of each word
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }

        // Remove trailing space and return
        return result.toString().trim();
    }
}