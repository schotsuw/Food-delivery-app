package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
import com.foodfetch.paymentservice.service.TransactionSecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * TransactionSecurityHandler.java
 * This class handles the transaction security processing.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 */
@Component
public class TransactionSecurityHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionSecurityHandler.class);

    // Next handler in the chain
    private PaymentHandler nextHandler;

    // Service to handle transaction security operations
    private final TransactionSecurityService securityService;

    /**
     * Constructor for TransactionSecurityHandler
     *
     * @param securityService Service to handle transaction security operations
     */
    public TransactionSecurityHandler(TransactionSecurityService securityService) {
        this.securityService = securityService;
    }

    /**
     * Sets the next handler in the chain.
     *
     * @param handler The next PaymentHandler
     */
    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    /**
     * Processes the transaction security.
     * If security processing is successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be processed
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Performing security processing for payment: {}", payment.getId());

        try {
            // Sign the transaction with HMAC
            String signature = securityService.signTransaction(payment);

            // Set the signature on the payment
            payment.setSecuritySignature(signature);

            LOGGER.info("Transaction signed successfully: {}", payment.getId());
            LOGGER.debug("Transaction signature: {}", signature);

            // If security processing is successful, proceed to next handler
            if (nextHandler != null) {
                nextHandler.process(payment);
            }
        } catch (Exception e) {
            LOGGER.error("Error during transaction security processing: {}", e.getMessage());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Security processing failed: " + e.getMessage());
        }
    }
}