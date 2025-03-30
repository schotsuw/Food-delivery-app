package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * PaymentEvent is a class that represents an event related to a payment.
 * It contains information about the payment ID, order ID, status, amount, transaction ID, timestamp, and event type.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent implements Serializable {
    private Long paymentId;
    private String orderId;
    private PaymentStatus status;
    private Double amount;
    private String transactionId;
    private LocalDateTime timestamp;
    private String eventType;

    // Common event types as constants
    // represents the type of event that occurred
    @Getter
    public static final String PAYMENT_PROCESSED = "PAYMENT_PROCESSED";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    public static final String PAYMENT_REFUNDED = "PAYMENT_REFUNDED";
    public static final String PAYMENT_UPDATED = "PAYMENT_UPDATED";
}



