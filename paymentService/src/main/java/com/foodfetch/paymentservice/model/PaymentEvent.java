package com.foodfetch.paymentservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent implements Serializable {
    private Long paymentId;
    private Long orderId;
    private PaymentStatus status;
    private Double amount;
    private String transactionId;
    private LocalDateTime timestamp;
    private String eventType;

    // Common event types as constants
    public static final String PAYMENT_PROCESSED = "PAYMENT_PROCESSED";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    public static final String PAYMENT_REFUNDED = "PAYMENT_REFUNDED";
}