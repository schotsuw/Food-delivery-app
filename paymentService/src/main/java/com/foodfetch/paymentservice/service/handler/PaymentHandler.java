package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.model.Payment;

public interface PaymentHandler {
    void setNext(PaymentHandler handler);
    void process(Payment payment);
}
