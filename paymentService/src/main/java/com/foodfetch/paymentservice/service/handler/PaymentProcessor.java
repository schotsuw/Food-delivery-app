package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;

public class PaymentProcessor {
    private final PaymentHandler chain;

    public PaymentProcessor(
            PaymentValidationHandler validationHandler,
            PaymentGatewayHandler gatewayHandler,
            PaymentDatabaseHandler databaseHandler,
            PaymentNotificationHandler notificationHandler) {

        // Build the chain
        chain = validationHandler;
        validationHandler.setNext(gatewayHandler);
        gatewayHandler.setNext(databaseHandler);
        databaseHandler.setNext(notificationHandler);
    }

    public void processPayment(Payment payment) {
        chain.process(payment);
    }
}
