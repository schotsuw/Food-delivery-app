package com.foodfetch.orderService.model;

/**
 * PaymentStatus is an enumeration that represents the status of a payment.
 * It can be one of the following: PENDING, COMPLETED, FAILED, or REFUNDED.
 */
public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}