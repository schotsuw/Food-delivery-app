package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CreditCardPaymentStrategy implements PaymentStrategy{
    private static final Logger LOGGER = LoggerFactory.getLogger(CreditCardPaymentStrategy.class);

    @Override
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing credit card payment: {}", payment.getTransactionId());
        // Credit card payment processing logic would go here
        // For simulation, return success 95% of the time
        return Math.random() < 0.95;
    }

    @Override
    public boolean processRefund(Payment refund, Payment originalPayment) {
        LOGGER.info("Processing credit card refund: {}", refund.getTransactionId());
        // Credit card refund processing logic would go here
        // For simulation, return success 90% of the time
        return Math.random() < 0.9;
    }
}
