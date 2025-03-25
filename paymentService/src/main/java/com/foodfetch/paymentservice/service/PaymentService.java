package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.messaging.RabbitMQSender;
import com.foodfetch.paymentservice.model.OrderEvent;
import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.model.PaymentEvent;
import com.foodfetch.paymentservice.model.PaymentStatus;
import com.foodfetch.paymentservice.repository.PaymentRepository;
import com.foodfetch.paymentservice.service.handler.PaymentProcessor;
import com.foodfetch.paymentservice.service.strategy.PaymentStrategyContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final RabbitMQSender rabbitMQSender;

    private final PaymentStrategyContext strategyContext;
    private final PaymentProcessor paymentProcessor;

    public PaymentService(PaymentRepository paymentRepository, RabbitMQSender rabbitMQSender, PaymentStrategyContext strategyContext, PaymentProcessor paymentProcessor) {
        this.paymentRepository = paymentRepository;
        this.rabbitMQSender = rabbitMQSender;
        this.strategyContext = strategyContext;
        this.paymentProcessor = paymentProcessor;
    }

    @Transactional
    public Payment processInitialPayment(OrderEvent orderEvent) {
        LOGGER.info("Processing payment for order: {}", orderEvent.getOrderId());

        // Validate order event first (before creating payment)
        if (orderEvent.getTotalAmount() <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        if (orderEvent.getOrderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }

        // Create a new payment record
        Payment payment = new Payment();
        payment.setOrderId(orderEvent.getOrderId());
        payment.setAmount(orderEvent.getTotalAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCreated(LocalDateTime.now());

        // In a real system, you would integrate with a payment gateway here
        // For this example, we'll simulate a successful payment

        // Generate a transaction ID (in real system, this would come from payment gateway)
        String transactionId = UUID.randomUUID().toString();
        payment.setTransactionId(transactionId);

        // Set payment method from the order event, or use default if not provided
        String paymentMethod = orderEvent.getPaymentMethod();
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            paymentMethod = "CREDIT_CARD"; // Default only if not specified
        }
        payment.setPaymentMethod(paymentMethod);

        // Save payment record
        payment = paymentRepository.save(payment);

        // Process the payment through gateway (this will use BOTH patterns)
        boolean paymentSuccessful = processPaymentWithGateway(payment);

        if (paymentSuccessful) {
            payment.setStatus(PaymentStatus.COMPLETED);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        // Update payment record
        payment = paymentRepository.save(payment);

        // Send payment event
        PaymentEvent paymentEvent = new PaymentEvent();
        paymentEvent.setPaymentId(payment.getId());
        paymentEvent.setOrderId(payment.getOrderId());
        paymentEvent.setStatus(payment.getStatus());
        paymentEvent.setAmount(payment.getAmount());
        paymentEvent.setTransactionId(payment.getTransactionId());
        paymentEvent.setTimestamp(LocalDateTime.now());

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            paymentEvent.setEventType(PaymentEvent.PAYMENT_PROCESSED);
        } else {
            paymentEvent.setEventType(PaymentEvent.PAYMENT_FAILED);
        }

        rabbitMQSender.sendPaymentEvent(paymentEvent);

        return payment;
    }

    @Transactional
    public Payment processRefund(OrderEvent orderEvent) {
        LOGGER.info("Processing refund for order: {}", orderEvent.getOrderId());

        // Find the original payment
        Payment originalPayment = paymentRepository.findByOrderId(orderEvent.getOrderId())
                .stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .findFirst()
                .orElse(null);

        if (originalPayment == null) {
            LOGGER.error("No completed payment found for order: {}", orderEvent.getOrderId());
            return null;
        }

        // Create a refund record
        Payment refund = new Payment();
        refund.setOrderId(orderEvent.getOrderId());
        refund.setAmount(originalPayment.getAmount());
        refund.setStatus(PaymentStatus.PENDING);
        refund.setPaymentMethod(originalPayment.getPaymentMethod());
        refund.setTransactionId("REFUND-" + UUID.randomUUID().toString());
        refund.setCreated(LocalDateTime.now());

        // Save refund record
        refund = paymentRepository.save(refund);

        // Process the refund (simulate payment gateway call)
        boolean refundSuccessful = processRefundWithGateway(refund, originalPayment);

        if (refundSuccessful) {
            refund.setStatus(PaymentStatus.REFUNDED);
            originalPayment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(originalPayment);
        } else {
            refund.setStatus(PaymentStatus.FAILED);
        }

        // Update refund record
        refund = paymentRepository.save(refund);

        // Send payment event
        PaymentEvent paymentEvent = new PaymentEvent();
        paymentEvent.setPaymentId(refund.getId());
        paymentEvent.setOrderId(refund.getOrderId());
        paymentEvent.setStatus(refund.getStatus());
        paymentEvent.setAmount(refund.getAmount());
        paymentEvent.setTransactionId(refund.getTransactionId());
        paymentEvent.setTimestamp(LocalDateTime.now());

        if (refund.getStatus() == PaymentStatus.REFUNDED) {
            paymentEvent.setEventType(PaymentEvent.PAYMENT_REFUNDED);
        } else {
            paymentEvent.setEventType(PaymentEvent.PAYMENT_FAILED);
        }

        rabbitMQSender.sendPaymentEvent(paymentEvent);

        return refund;
    }

    // Simulate payment gateway integration
    private boolean processPaymentWithGateway(Payment payment) {
        // Use the strategy pattern to process the payment based on payment method
        boolean gatewaySuccess = strategyContext.processPayment(payment);

        if (gatewaySuccess) {
            // Use the chain of responsibility to handle the complete payment workflow
            paymentProcessor.processPayment(payment);
        }

        return gatewaySuccess;
    }

    // Simulate refund gateway integration
    private boolean processRefundWithGateway(Payment refund, Payment originalPayment) {
        // In a real system, this would integrate with a payment gateway API
        // For this example, we'll simulate a 90% success rate
        return Math.random() < 0.9;
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}