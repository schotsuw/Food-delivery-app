package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentValidationHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentValidationHandler.class);
    private PaymentHandler nextHandler;

    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    @Override
    public void process(Payment payment) {
        LOGGER.info("Validating payment: {}", payment.getId());

        // Perform validation logic
        if (payment.getAmount() <= 0) {
            LOGGER.error("Invalid payment amount: {}", payment.getAmount());
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        if (payment.getOrderId() == null) {
            LOGGER.error("Missing order ID for payment");
            throw new IllegalArgumentException("Order ID is required");
        }

        // If validation passes, proceed to next handler
        if (nextHandler != null) {
            nextHandler.process(payment);
        }
    }
}
