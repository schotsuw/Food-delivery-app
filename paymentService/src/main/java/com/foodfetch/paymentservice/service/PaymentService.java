package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.messaging.OrderEvent;
import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentStatus;
import com.foodfetch.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * PaymentService is a service class that provides methods to manage payments.
 * It delegates to specialized services for specific responsibilities:
 * - PaymentGatewayService for payment gateway interactions
 * - PaymentEventService for event publishing
 * - PaymentRepository for database operations
 * It handles payment processing, refunds, and retrieval of payment records.
 */
@Service
public class PaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentService.class);

    // PaymentRepository instance to handle payment-related database operations
    private final PaymentRepository paymentRepository;

    // PaymentEventService instance to handle payment events
    private final PaymentEventService paymentEventService;

    // PaymentGatewayService instance to handle payment gateway interactions
    private final PaymentGatewayService paymentGatewayService;

    /**
     * Constructor for PaymentService
     *
     * @param paymentRepository      Repository to handle payment operations
     * @param paymentEventService    Service to handle payment events
     * @param paymentGatewayService  Service to handle payment gateway interactions
     */
    public PaymentService(
            PaymentRepository paymentRepository,
            PaymentEventService paymentEventService,
            PaymentGatewayService paymentGatewayService) {
        this.paymentRepository = paymentRepository;
        this.paymentEventService = paymentEventService;
        this.paymentGatewayService = paymentGatewayService;
    }

    /**
     * Process initial payment for an order
     *
     * @param orderEvent The order event containing payment details
     * @return The processed payment
     */
    @Transactional
    public Payment processInitialPayment(OrderEvent orderEvent) {
        LOGGER.info("Processing payment for order: {}", orderEvent.getOrderId());

        // Validate order event
        validateOrderEvent(orderEvent);

        // Create and save initial payment record
        Payment payment = createPaymentFromOrderEvent(orderEvent);
        payment = paymentRepository.save(payment);

        // Process the payment through gateway service
        boolean paymentSuccessful = paymentGatewayService.processPayment(payment);

        // Update payment status based on result
        updatePaymentStatus(payment, paymentSuccessful);

        // Publish appropriate payment event
        paymentEventService.publishPaymentStatusEvent(payment);

        return payment;
    }

    /**
     * Process refund for an order
     *
     * @param orderEvent The order event containing refund details
     * @return The processed refund payment
     */
    @Transactional
    public Payment processRefund(OrderEvent orderEvent) {
        LOGGER.info("Processing refund for order: {}", orderEvent.getOrderId());

        // Find the original payment
        Payment originalPayment = findCompletedPaymentForOrder(orderEvent.getOrderId());
        if (originalPayment == null) {
            LOGGER.error("No completed payment found for order: {}", orderEvent.getOrderId());
            return null;
        }

        // Create and save refund record
        Payment refund = createRefundFromOriginalPayment(originalPayment);
        refund = paymentRepository.save(refund);

        // Process the refund through gateway service
        boolean refundSuccessful = paymentGatewayService.processRefund(refund, originalPayment);

        // Update refund and original payment status based on result
        updateRefundStatus(refund, originalPayment, refundSuccessful);

        // Publish appropriate payment event
        paymentEventService.publishPaymentStatusEvent(refund);

        return refund;
    }

    /**
     * Get payment by ID
     *
     * @param id The payment ID
     * @return The payment, or null if not found
     */
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    /**
     * Get payment by transaction ID
     *
     * @param transactionId The transaction ID
     * @return The payment, or null if not found
     */
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    /**
     * Get all payments
     *
     * @return List of all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Private helper methods

    /**
     * Validate order event for payment processing
     *
     * @param orderEvent The order event to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateOrderEvent(OrderEvent orderEvent) {
        if (orderEvent.getTotalAmount() <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        if (orderEvent.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
    }

    /**
     * Create a payment object from an order event
     *
     * @param orderEvent The order event containing payment details
     * @return The created payment object
     */
    private Payment createPaymentFromOrderEvent(OrderEvent orderEvent) {

        // Create a new payment object
        Payment payment = new Payment();
        payment.setOrderId(orderEvent.getOrderId());
        payment.setAmount(orderEvent.getTotalAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreated(LocalDateTime.now());

        // Generate a transaction ID
        String transactionId = UUID.randomUUID().toString();
        payment.setTransactionId(transactionId);

        // Set payment method from the order event, or use default if not provided
        String paymentMethod = orderEvent.getPaymentMethod();
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            LOGGER.warn("Payment method not specified, using default: CREDIT_CARD");
            paymentMethod = "CREDIT_CARD"; // Default only if not specified
        }
        payment.setPaymentMethod(paymentMethod);

        return payment;
    }

    /**
     * Update payment status based on payment result
     *
     * @param payment The payment to update
     * @param successful Whether the payment was successful
     * @return The updated payment
     */
    private Payment updatePaymentStatus(Payment payment, boolean successful) {
        // Update payment status based on success or failure
        LOGGER.info("Updating payment status: {}", payment.getPaymentMethod());
        payment.setStatus(successful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }

    /**
     * Find a completed payment for an order
     *
     * @param orderId The order ID
     * @return The completed payment, or null if not found
     */
    private Payment findCompletedPaymentForOrder(String orderId) {
        LOGGER.info("Finding completed payment for order: {}", orderId);
        return paymentRepository.findByOrderId(orderId)
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .findFirst()
                .orElse(null);
    }

    /**
     * Create a refund payment based on an original payment
     *
     * @param originalPayment The original payment
     * @return The created refund payment
     */
    private Payment createRefundFromOriginalPayment(Payment originalPayment) {
        // Create a new refund payment object
        Payment refund = new Payment();
        refund.setOrderId(originalPayment.getOrderId());
        refund.setAmount(originalPayment.getAmount());
        refund.setStatus(PaymentStatus.PENDING);
        refund.setPaymentMethod(originalPayment.getPaymentMethod());
        refund.setTransactionId("REFUND-" + UUID.randomUUID().toString());
        refund.setCreated(LocalDateTime.now());
        return refund;
    }

    /**
     * Update refund and original payment status based on refund result
     *
     * @param refund The refund payment to update
     * @param originalPayment The original payment to update
     * @param successful Whether the refund was successful
     */
    private void updateRefundStatus(Payment refund, Payment originalPayment, boolean successful) {
        // Update refund status based on success or failure
        if (successful) {
            LOGGER.info("Updating refund status: {}", refund.getPaymentMethod());
            refund.setStatus(PaymentStatus.REFUNDED);
            originalPayment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(originalPayment);
        } else {
            refund.setStatus(PaymentStatus.FAILED);
        }
        paymentRepository.save(refund);
    }
}