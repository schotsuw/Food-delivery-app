package com.foodfetch.paymentservice.model;

/**
 * PaymentStatus.java
 * This enum represents the various statuses a payment can have in the food delivery system.
 * It is used to track the progress of a payment from pending to completed or failed.
 */
public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}
