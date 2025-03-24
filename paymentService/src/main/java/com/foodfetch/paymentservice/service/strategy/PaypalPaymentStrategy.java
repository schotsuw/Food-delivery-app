package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaypalPaymentStrategy implements PaymentStrategy {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaypalPaymentStrategy.class);

    @Override
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing PayPal payment: {}", payment.getTransactionId());
        // PayPal payment processing logic would go here
        // For simulation, return success 93% of the time
        return Math.random() < 0.93;
    }

    @Override
    public boolean processRefund(Payment refund, Payment originalPayment) {
        LOGGER.info("Processing PayPal refund: {}", refund.getTransactionId());
        // PayPal refund processing logic would go here
        // For simulation, return success 92% of the time
        return Math.random() < 0.92;
    }
}
