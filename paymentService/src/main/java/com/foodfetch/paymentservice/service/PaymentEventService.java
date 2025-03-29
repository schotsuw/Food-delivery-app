package com.foodfetch.paymentservice.service;

import com.foodfetch.paymentservice.messaging.RabbitMQSender;
import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.messaging.PaymentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * PaymentEventService.java
 * This service class is responsible for creating and publishing payment events.
 * It uses RabbitMQSender to send messages to the RabbitMQ queue.
 */
@Service
public class PaymentEventService {

    // RabbitMQSender instance to send messages to RabbitMQ
    private final RabbitMQSender rabbitMQSender;
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentEventService.class);

    /**
     * Constructor for PaymentEventService
     *
     * @param rabbitMQSender RabbitMQ sender for sending payment events
     */
    public PaymentEventService(RabbitMQSender rabbitMQSender) {
        this.rabbitMQSender = rabbitMQSender;
    }

    /**
     * Publishes a payment event to RabbitMQ.
     * This method creates a PaymentEvent object and sends it to the RabbitMQ queue.
     *
     * @param payment The payment object containing payment details
     * @param eventType The type of event (e.g., PAYMENT_PROCESSED, PAYMENT_FAILED)
     */
    public void publishPaymentEvent(Payment payment, String eventType) {
        LOGGER.info("Creating and publishing {} event for payment: {}", eventType, payment.getId());

        PaymentEvent paymentEvent = new PaymentEvent();
        paymentEvent.setPaymentId(payment.getId());
        paymentEvent.setOrderId(payment.getOrderId());
        paymentEvent.setStatus(payment.getStatus());
        paymentEvent.setAmount(payment.getAmount());
        paymentEvent.setTransactionId(payment.getTransactionId());
        paymentEvent.setTimestamp(LocalDateTime.now());
        paymentEvent.setEventType(eventType);

        rabbitMQSender.sendPaymentEvent(paymentEvent);
        LOGGER.info("Payment event published successfully");
    }

    /**
     * Determine appropriate event type based on payment status and publish it
     *
     * @param payment The payment object containing payment details
     */
    public void publishPaymentStatusEvent(Payment payment) {
        String eventType;

        switch (payment.getStatus()) {
            case COMPLETED:
                eventType = PaymentEvent.PAYMENT_PROCESSED;
                break;
            case REFUNDED:
                eventType = PaymentEvent.PAYMENT_REFUNDED;
                break;
            case FAILED:
                eventType = PaymentEvent.PAYMENT_FAILED;
                break;
            default:
                eventType = "PAYMENT_UPDATED";
        }

        publishPaymentEvent(payment, eventType);
    }
}