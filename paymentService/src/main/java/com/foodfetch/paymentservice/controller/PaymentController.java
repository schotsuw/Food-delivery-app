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
 * PaymentController provides REST endpoints for payment operations.
 * It allows fetching payment details by ID or transaction ID, processing payments, and retrieving all payments.
 * It uses PaymentService to handle business logic.
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
     * Get a payment by ID
     *
     * @param id The payment ID
     * @return The payment, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        LOGGER.info("Fetching payment with ID: {}", id);

        // Fetch payment by ID using the PaymentService
        Payment payment = paymentService.getPaymentById(id);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Test endpoint for processing a payment
     *
     * @param orderEvent The order event containing payment details
     * @return The processed payment
     */
    @PostMapping("/test-payment")
    public ResponseEntity<?> testPayment(@RequestBody OrderEvent orderEvent) {
        LOGGER.info("Testing payment for order: {}", orderEvent.getOrderId());
        try {
            // Validate order event
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
     * Get a payment by transaction ID
     *
     * @param transactionId The transaction ID
     * @return The payment, or 404 if not found
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        LOGGER.info("Fetching payment with transaction ID: {}", transactionId);
        // Fetch payment by transaction ID using the PaymentService
        Payment payment = paymentService.getPaymentByTransactionId(transactionId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get all payments
     *
     * @return List of all payments
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        LOGGER.info("Fetching all payments");
        // Fetch all payments using the PaymentService
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
}