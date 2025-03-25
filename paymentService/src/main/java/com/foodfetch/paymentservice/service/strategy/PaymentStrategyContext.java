package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PaymentStrategyContext {
    private final Map<String, PaymentStrategy> strategies;

    public PaymentStrategyContext(
            CreditCardPaymentStrategy creditCardStrategy,
            PaypalPaymentStrategy paypalStrategy) {
        strategies = new HashMap<>();
        strategies.put("CREDIT_CARD", creditCardStrategy);
        strategies.put("PAYPAL", paypalStrategy);
    }

    public boolean processPayment(Payment payment) {
        PaymentStrategy strategy = strategies.get(payment.getPaymentMethod());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + payment.getPaymentMethod());
        }
        return strategy.processPayment(payment);
    }

    public boolean processRefund(Payment refund, Payment originalPayment) {
        PaymentStrategy strategy = strategies.get(refund.getPaymentMethod());
        if (strategy == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + refund.getPaymentMethod());
        }
        return strategy.processRefund(refund, originalPayment);
    }
}
