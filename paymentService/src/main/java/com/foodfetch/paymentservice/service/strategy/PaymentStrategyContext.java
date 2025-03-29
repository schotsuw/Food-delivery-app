package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * PaymentStrategyContext is a context class that manages different payment strategies.
 * It allows for the selection of a specific payment strategy based on the payment method.
 * This class is responsible for processing payments and refunds using the appropriate strategy.
 */
@Component
public class PaymentStrategyContext {

    // Map to hold different payment strategies
    private final Map<String, PaymentStrategy> strategies;

    /**
     * Constructor for PaymentStrategyContext
     *
     * @param creditCardStrategy The strategy for processing credit card payments
     * @param paypalStrategy     The strategy for processing PayPal payments
     */
    public PaymentStrategyContext(
            CreditCardPaymentStrategy creditCardStrategy,
            PaypalPaymentStrategy paypalStrategy) {
        strategies = new HashMap<>();
        strategies.put("CREDIT_CARD", creditCardStrategy);
        strategies.put("PAYPAL", paypalStrategy);
    }

    /**
     * Processes a payment using the appropriate strategy based on the payment method.
     *
     * @param payment The payment to be processed
     * @return true if the payment is successful, false otherwise
     */
    public boolean processPayment(Payment payment) {

        // Select the appropriate strategy based on the payment method
        PaymentStrategy strategy = strategies.get(payment.getPaymentMethod());

        // If the strategy is not found, throw an exception
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + payment.getPaymentMethod());
        }
        return strategy.processPayment(payment);
    }

    /**
     * Processes a refund using the appropriate strategy based on the payment method.
     *
     * @param refund           The refund to be processed
     * @param originalPayment  The original payment for which the refund is being processed
     * @return true if the refund is successful, false otherwise
     */
    public boolean processRefund(Payment refund, Payment originalPayment) {
        PaymentStrategy strategy = strategies.get(refund.getPaymentMethod());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + refund.getPaymentMethod());
        }
        return strategy.processRefund(refund, originalPayment);
    }
}
