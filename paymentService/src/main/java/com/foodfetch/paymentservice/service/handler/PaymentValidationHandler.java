package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
import com.foodfetch.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * PaymentValidationHandler.java
 * This class handles the payment validation process.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 */
@Component
public class PaymentValidationHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentValidationHandler.class);

    // Define security limits
    private static final double MAX_TRANSACTION_AMOUNT = 10000.0; // Example limit
    private static final int MAX_DAILY_TRANSACTIONS = 10; // Example limit

    // Next handler in the chain
    private PaymentHandler nextHandler;

    // Repository to handle payment operations
    private final PaymentRepository paymentRepository;

    /**
     * Constructor for PaymentValidationHandler
     *
     * @param paymentRepository Repository to handle payment operations
     */
    public PaymentValidationHandler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
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
     * Processes the payment validation.
     * If validation is successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be validated
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Validating payment: {}", payment.getId());

        try {
            // Basic validation
            validateBasicFields(payment);

            // Security validation
            validateSecurityRules(payment);

            // If validation passes, proceed to next handler
            if (nextHandler != null) {
                LOGGER.info("Payment validation successful, proceeding to next handler");
                nextHandler.process(payment);
            }
        } catch (ValidationException e) {
            LOGGER.error("Payment validation failed: {}", e.getMessage());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            // Do not proceed to next handler
        }
    }

    /**
     * Validates the basic fields of the payment.
     *
     * @param payment The payment to be validated
     * @throws ValidationException If validation fails
     */
    private void validateBasicFields(Payment payment) throws ValidationException {
        // Existing validation logic
        if (payment.getAmount() <= 0) {
            throw new ValidationException("Payment amount must be greater than zero");
        }

        if (payment.getOrderId() == null || payment.getOrderId().trim().isEmpty()) {
            throw new ValidationException("Order ID is required");
        }
    }

    /**
     * Validates the security rules for the payment.
     *
     * @param payment The payment to be validated
     * @throws ValidationException If validation fails
     */
    private void validateSecurityRules(Payment payment) throws ValidationException {
        // Amount limit check
        if (payment.getAmount() > MAX_TRANSACTION_AMOUNT) {
            throw new ValidationException("Transaction amount exceeds maximum allowed limit");
        }

        // Duplicate transaction check
        Payment existingTransaction = paymentRepository.findByTransactionId(payment.getTransactionId());
        if (existingTransaction != null) {
            throw new ValidationException("Duplicate transaction ID detected");
        }

        // Multiple payments for same order check
        List<Payment> existingPayments = paymentRepository.findByOrderId(payment.getOrderId());
        if (existingPayments.size() >= 3) {
            throw new ValidationException("Too many payment attempts for the same order");
        }

        // Daily transaction limit check
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        int dailyCount = paymentRepository.countByPaymentMethodAndCreatedAfter(
                payment.getPaymentMethod(), startOfDay);

        if (dailyCount >= MAX_DAILY_TRANSACTIONS) {
            throw new ValidationException("Daily transaction limit reached for this payment method");
        }
    }

    /**
     * Custom exception class for validation errors.
     */
    private static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }
}