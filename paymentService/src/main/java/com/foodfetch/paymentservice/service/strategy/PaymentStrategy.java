package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;

/**
 * PaymentStrategy is an interface that defines the structure for payment processing strategies.
 * It allows for different payment methods to be implemented, such as credit card, PayPal, etc.
 * Each strategy must implement the processPayment and processRefund methods.
 */
public interface PaymentStrategy {
    // Processes a payment
    boolean processPayment(Payment payment);

    // Processes a refund
    boolean processRefund(Payment refund, Payment originalPayment);
}
