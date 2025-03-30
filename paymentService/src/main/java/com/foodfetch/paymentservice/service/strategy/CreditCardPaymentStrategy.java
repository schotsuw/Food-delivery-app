package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * CreditCardPaymentStrategy.java
 * This class implements the PaymentStrategy interface for processing credit card payments.
 * It simulates the payment and refund process with a high success rate. (Because we are not actually connect to Stripe or any other payment gateway)
 */
@Component
public class CreditCardPaymentStrategy implements PaymentStrategy {
    private static final Logger LOGGER = LoggerFactory.getLogger(CreditCardPaymentStrategy.class);

    /**
     * Processes a credit card payment.
     * This method simulates the payment process and returns a success status.
     *
     * @param payment The payment to be processed
     * @return true if the payment is successful, false otherwise
     */
    @Override
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing credit card payment: {}", payment.getTransactionId());

        // For simulation, return success 95% of the time
        return Math.random() < 0.95;
    }

    /**
     * Processes a credit card refund.
     * This method simulates the refund process and returns a success status.
     *
     * @param refund The refund to be processed
     * @param originalPayment The original payment for which the refund is being processed
     * @return true if the refund is successful, false otherwise
     */
    @Override
    public boolean processRefund(Payment refund, Payment originalPayment) {
        LOGGER.info("Processing credit card refund: {}", refund.getTransactionId());

        // For simulation, return success 90% of the time
        return Math.random() < 0.9;
    }
}
