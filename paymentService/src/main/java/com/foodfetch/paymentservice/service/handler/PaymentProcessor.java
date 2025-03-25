package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.springframework.stereotype.Component;

@Component
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
