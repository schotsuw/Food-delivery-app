package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * PaymentValidationHandler.java
 * This class handles the payment validation process.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 */
@Component
public class PaymentValidationHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentValidationHandler.class);

    // Next handler in the chain
    private PaymentHandler nextHandler;

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
     * Processes the payment by validating it.
     * If validation is successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be processed
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Validating payment: {}", payment.getId());

        // Perform validation logic
        if (payment.getAmount() <= 0) {
            LOGGER.error("Invalid payment amount: {}", payment.getAmount());
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        // Check if payment method is valid
        if (payment.getOrderId() == null || payment.getOrderId().trim().isEmpty()) {
            LOGGER.error("Missing order ID for payment");
            throw new IllegalArgumentException("Order ID is required");
        }

        // If validation passes, proceed to next handler
        if (nextHandler != null) {
            LOGGER.info("Payment validation successful, proceeding to next handler");
            nextHandler.process(payment);
        }
    }
}