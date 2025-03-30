package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.springframework.stereotype.Component;

/**
 * PaymentProcessor.java
 * This class orchestrates the payment processing by creating a chain of responsibility.
 * It initializes the chain with various handlers and processes the payment through them.
 */
@Component
public class PaymentProcessor {

    // Chain of responsibility for payment processing
    private final PaymentHandler chain;

    /**
     * Constructor for PaymentProcessor
     *
     * @param validationHandler The first handler in the chain for payment validation
     * @param gatewayHandler    The second handler in the chain for payment gateway processing
     * @param databaseHandler   The third handler in the chain for database operations
     * @param notificationHandler The last handler in the chain for sending notifications
     */
    public PaymentProcessor(
            PaymentValidationHandler validationHandler,
            PaymentGatewayHandler gatewayHandler,
            PaymentDatabaseHandler databaseHandler,
            PaymentNotificationHandler notificationHandler) {

        // Build the chain
        chain = validationHandler;

        // Set up the chain of responsibility
        validationHandler.setNext(gatewayHandler);
        gatewayHandler.setNext(databaseHandler);
        databaseHandler.setNext(notificationHandler);
    }

    /**
     * Processes the payment by passing it through the chain of handlers.
     *
     * @param payment The payment to be processed
     */
    public void processPayment(Payment payment) {
        chain.process(payment);
    }
}
