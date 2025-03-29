package com.foodfetch.paymentservice.repository;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PaymentRepository is an interface that extends JpaRepository to provide CRUD operations for Payment.
 * It contains methods to find payments by order ID, status, and transaction ID.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Update to use String for orderId
    List<Payment> findByOrderId(String orderId);
    // Update to use String for status
    List<Payment> findByStatus(PaymentStatus status);
    // Update to use String for transactionId
    Payment findByTransactionId(String transactionId);
}