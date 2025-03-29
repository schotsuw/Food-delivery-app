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
 * PaymentService.java
 * This class handles payment processing, including initial payments and refunds.
 * It uses the PaymentRepository to interact with the database and the PaymentGatewayService to process payments.
 */
@Service
public class PaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentService.class);

    // Repository to handle payment operations
    private final PaymentRepository paymentRepository;

    // Service to handle payment events
    private final PaymentEventService paymentEventService;

    // Service to handle payment gateway operations
    private final PaymentGatewayService paymentGatewayService;

    /**
     * Constructor for PaymentService
     *
     * @param paymentRepository Repository to handle payment operations
     * @param paymentEventService Service to handle payment events
     * @param paymentGatewayService Service to handle payment gateway operations
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
     * Processes the initial payment for an order.
     * This method validates the order event, creates a payment record, and processes the payment through the gateway service.
     *
     * @param orderEvent The order event containing payment details
     * @return The processed payment
     */
    @Transactional
    public Payment processInitialPayment(OrderEvent orderEvent) {
        LOGGER.info("Processing payment for order: {}", orderEvent.getOrderId());

        // Validate order event
        validateOrderEvent(orderEvent);

        // Create initial payment record (but don't save yet)
        Payment payment = createPaymentFromOrderEvent(orderEvent);

        // Check for existing transaction ID before processing
        if (paymentRepository.findByTransactionId(payment.getTransactionId()) != null) {
            LOGGER.warn("Duplicate transaction detected, generating new transaction ID");
            // Generate a new transaction ID
            payment.setTransactionId(UUID.randomUUID().toString());
        }

        // Process the payment through gateway service
        boolean paymentSuccessful = paymentGatewayService.processPayment(payment);

        // Update payment status based on result
        payment.setStatus(paymentSuccessful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);

        // Save payment after processing
        payment = paymentRepository.save(payment);

        // Publish appropriate payment event
        paymentEventService.publishPaymentStatusEvent(payment);

        return payment;
    }

    /**
     * Processes a refund for an order.
     * This method finds the original payment, creates a refund record, and processes the refund through the gateway service.
     *
     * @param orderEvent The order event containing refund details
     * @return The processed refund
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

        // Create refund record
        Payment refund = createRefundFromOriginalPayment(originalPayment);

        // Check for existing transaction ID before processing
        if (paymentRepository.findByTransactionId(refund.getTransactionId()) != null) {
            LOGGER.warn("Duplicate refund transaction detected, generating new transaction ID");
            // Generate a new transaction ID
            refund.setTransactionId("REFUND-" + UUID.randomUUID().toString());
        }

        // Save refund record
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
     * Retrieves a payment by its ID.
     *
     * @param id The ID of the payment
     * @return The payment object, or null if not found
     */
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    /**
     * Retrieves a payment by its transaction ID.
     *
     * @param transactionId The transaction ID of the payment
     * @return The payment object, or null if not found
     */
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    /**
     * Retrieves all payments.
     *
     * @return A list of all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Retrieves all payments for a specific order ID.
     *
     * @param orderEvent The order ID of the payments
     * @return A list of payments for the specified order ID
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
     * Creates a new payment record from the order event.
     *
     * @param orderEvent The order event containing payment details
     * @return The created payment object
     */
    private Payment createPaymentFromOrderEvent(OrderEvent orderEvent) {
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
     * Updates the payment status based on the result of the payment processing.
     *
     * @param payment The payment object to update
     * @param successful Indicates whether the payment was successful
     * @return The updated payment object
     */
    private Payment updatePaymentStatus(Payment payment, boolean successful) {
        LOGGER.info("Updating payment status: {}", payment.getPaymentMethod());
        payment.setStatus(successful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }

    /**
     * Finds a completed payment for a specific order ID.
     *
     * @param orderId The order ID to search for
     * @return The completed payment object, or null if not found
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
     * Creates a refund record from the original payment.
     *
     * @param originalPayment The original payment to create a refund from
     * @return The created refund object
     */
    private Payment createRefundFromOriginalPayment(Payment originalPayment) {
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
     * Updates the refund status based on the result of the refund processing.
     *
     * @param refund The refund object to update
     * @param originalPayment The original payment associated with the refund
     * @param successful Indicates whether the refund was successful
     */
    private void updateRefundStatus(Payment refund, Payment originalPayment, boolean successful) {
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