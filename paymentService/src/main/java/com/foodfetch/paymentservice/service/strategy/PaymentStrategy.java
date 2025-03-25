package com.foodfetch.paymentservice.service.strategy;

import com.foodfetch.paymentservice.model.Payment;

public interface PaymentStrategy {
    boolean processPayment(Payment payment);
    boolean processRefund(Payment refund, Payment originalPayment);
}
