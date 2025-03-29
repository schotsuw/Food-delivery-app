package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;

/**
 * PaymentHandler is an interface that defines the structure for handling payment processing.
 * It allows for the creation of a chain of responsibility pattern for processing payments.
 * Each handler can either process the payment or pass it to the next handler in the chain.
 */
public interface PaymentHandler {
    // Sets the next handler in the chain
    void setNext(PaymentHandler handler);

    // Processes the payment
    void process(Payment payment);
}
