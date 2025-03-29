package com.foodfetch.orderService.model;

import lombok.Data;

/**
 * PaymentDetails is a class that represents the details of a payment.
 * It contains information about the payment ID, status, payment method, and amount.
 */
@Data
public class PaymentDetails {
    private String paymentId;
    private PaymentStatus status;
    private String paymentMethod;
    private double amount;
}