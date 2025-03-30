package com.foodfetch.paymentservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Payment is a class that represents a payment transaction.
 * It contains information about the order ID, amount, status, payment method, transaction ID, and creation time.
 */
@Data
@Entity
@Table(name = "payments")
public class Payment {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Change from Long to String for MongoDB compatibility
    private String orderId;
    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentMethod;
    private String transactionId;
    private LocalDateTime created;


    @Setter
    @Getter
    private String securitySignature; // This is used to verify the integrity of the payment data
    @Setter
    @Getter
    private String failureReason;

}