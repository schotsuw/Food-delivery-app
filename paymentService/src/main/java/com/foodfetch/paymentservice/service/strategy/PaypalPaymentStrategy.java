package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * PaypalPaymentStrategy.java
 * This class implements the PaymentStrategy interface for processing PayPal payments.
 * It simulates the payment and refund process with a high success rate. (Because we are not actually connect to Stripe or any other payment gateway)
 */
@Component
public class PaypalPaymentStrategy implements PaymentStrategy {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaypalPaymentStrategy.class);

    /**
     * Processes a PayPal payment.
     * This method simulates the payment process and returns a success status.
     *
     * @param payment The payment to be processed
     * @return true if the payment is successful, false otherwise
     */
    @Override
    public boolean processPayment(Payment payment) {
        LOGGER.info("Processing PayPal payment: {}", payment.getTransactionId());
        // For simulation, return success 93% of the time
        return Math.random() < 0.93;
    }

    /**
     * Processes a PayPal refund.
     * This method simulates the refund process and returns a success status.
     *
     * @param refund The refund to be processed
     * @param originalPayment The original payment for which the refund is being processed
     * @return true if the refund is successful, false otherwise
     */
    @Override
    public boolean processRefund(Payment refund, Payment originalPayment) {
        LOGGER.info("Processing PayPal refund: {}", refund.getTransactionId());
        // For simulation, return success 92% of the time
        return Math.random() < 0.92;
    }
}
