package com.foodfetch.backend.model;

import lombok.Data;

@Data
public class PaymentDetails {
    private String paymentId;
    private PaymentStatus status;
    private String paymentMethod;
    private double amount;
}