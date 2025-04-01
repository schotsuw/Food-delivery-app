package com.foodfetch.paymentservice.controller;

import com.foodfetch.paymentservice.messaging.OrderEvent;
import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PaymentController handles HTTP requests related to payment operations.
 * It provides endpoints for creating, retrieving, and processing payments.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentController.class);

    /**
     * PaymentService instance to handle payment-related operations.
     */
    private final PaymentService paymentService;

    /**
     * Constructor for PaymentController
     *
     * @param paymentService Service to handle payment-related operations
     */
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Endpoint to create a new payment.
     *
     * @param id The payment to be created
     * @return Created Payment
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        LOGGER.info("Fetching payment with ID: {}", id);

        Payment payment = paymentService.getPaymentById(id);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Endpoint to test payment processing.
     *
     * @param orderEvent The order event containing payment details
     * @return ResponseEntity with the result of the payment processing
     */
    @PostMapping("/test-payment")
    public ResponseEntity<?> testPayment(@RequestBody OrderEvent orderEvent) {
        LOGGER.info("Testing payment for order: {}", orderEvent.getOrderId());
        try {
            // Process payment using the service
            Payment payment = paymentService.processInitialPayment(orderEvent);
            return ResponseEntity.ok(payment);
        }
        catch (IllegalArgumentException e) {
            LOGGER.error("Invalid payment request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            LOGGER.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error processing payment: " + e.getMessage());
        }
    }

    /**
     * Endpoint to process a refund.
     *
     * @param transactionId The order event containing refund details
     * @return ResponseEntity with the result of the refund processing
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        LOGGER.info("Fetching payment with transaction ID: {}", transactionId);
        Payment payment = paymentService.getPaymentByTransactionId(transactionId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Endpoint to retrieve all payments.
     *
     * @return List of all payments
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        LOGGER.info("Fetching all payments");
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}