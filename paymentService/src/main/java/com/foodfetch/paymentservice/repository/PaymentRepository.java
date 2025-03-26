package com.foodfetch.paymentservice.repository;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Update to use String for orderId
    List<Payment> findByOrderId(String orderId);
    List<Payment> findByStatus(PaymentStatus status);
    Payment findByTransactionId(String transactionId);
}