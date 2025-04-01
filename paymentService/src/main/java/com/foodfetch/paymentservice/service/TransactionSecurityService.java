package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * TransactionSecurityService is responsible for signing and verifying payment transactions.
 * It uses HMAC SHA-256 for signing and verifying the integrity of payment data.
 * This is crucial for preventing tampering and ensuring the authenticity of payment requests.
 */
@Component
public class TransactionSecurityService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionSecurityService.class);
    private final String secretKey; // Store securely (in a vault)

    /**
     * Constructor for TransactionSecurityService
     * @param secretKey
     */
    public TransactionSecurityService(
            @Value("${payment.security.secret-key:default-secret-key}") String secretKey) {
        this.secretKey = secretKey;
    }

    /**
     * Signs a payment transaction using HMAC SHA-256.
     * This method creates a signature based on critical payment fields to ensure data integrity.
     *
     * @param payment The payment object containing payment details
     * @return The generated signature as a Base64 encoded string
     */
    public String signTransaction(Payment payment) {

        // Create a signature based on critical payment fields
        String dataToSign = payment.getOrderId() + "|" +
                payment.getAmount() + "|" +
                payment.getTransactionId();

        try {
            // Create HMAC SHA-256 signature
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");

            // Use the secret key for signing
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");

            // Initialize the HMAC with the secret key
            sha256_HMAC.init(keySpec);

            // Generate the HMAC signature
            byte[] hash = sha256_HMAC.doFinal(dataToSign.getBytes());

            // Encode the hash to Base64
            return Base64.getEncoder().encodeToString(hash);
        }
        catch (Exception e) {
            logger.error("Error signing transaction: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Verifies the signature of a payment transaction.
     * This method checks if the provided signature matches the generated signature for the payment.
     *
     * @param payment The payment object containing payment details
     * @param signature The signature to verify
     * @return true if the signature is valid, false otherwise
     */
    public boolean verifySignature(Payment payment, String signature) {
        // Generate the expected signature
        String expectedSignature = signTransaction(payment);

        // Compare the expected signature with the provided signature
        return expectedSignature != null && expectedSignature.equals(signature);
    }
}
