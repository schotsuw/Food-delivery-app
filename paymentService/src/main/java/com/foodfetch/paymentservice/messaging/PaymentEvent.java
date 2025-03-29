package com.foodfetch.paymentservice.messaging;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
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
    // Change from Long to String for MongoDB compatibility
    private String orderId;
    private PaymentStatus status; // current state
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

    /**
     * Constructor to create a PaymentEvent from a Payment object and an event type.
     *
     * @param eventType the type of event
     * @param payment   the payment object
     */
    public PaymentEvent(String eventType, Payment payment) {
        this.paymentId = payment.getId();
        this.orderId = payment.getOrderId();
        this.status = payment.getStatus();
        this.amount = payment.getAmount();
        this.transactionId = payment.getTransactionId();
        this.timestamp = LocalDateTime.now();
        this.eventType = eventType;
    }
}

