package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.model.Payment;
import com.foodfetch.paymentservice.service.PaymentEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * PaymentNotificationHandler.java
 * This class handles the payment notification process.
 * It implements the PaymentHandler interface and follows the Chain of Responsibility pattern.
 * Now uses PaymentEventService instead of directly depending on RabbitMQSender.
 */
@Component
public class PaymentNotificationHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentNotificationHandler.class);

    // Next handler in the chain
    private PaymentHandler nextHandler;

    // Event service for publishing notifications
    private final PaymentEventService paymentEventService;

    /**
     * Constructor for PaymentNotificationHandler
     *
     * @param paymentEventService Service for publishing payment events
     */
    public PaymentNotificationHandler(PaymentEventService paymentEventService) {
        this.paymentEventService = paymentEventService;
    }

    /**
     * Sets the next handler in the chain.
     *
     * @param handler The next PaymentHandler
     */
    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    /**
     * Processes the payment notification.
     * If successful, it passes the payment to the next handler in the chain.
     *
     * @param payment The payment to be processed
     */
    @Override
    public void process(Payment payment) {
        LOGGER.info("Sending internal payment notification: {}", payment.getId());

        // Let the PaymentEventService handle notification specifics
        paymentEventService.publishPaymentStatusEvent(payment);

        LOGGER.info("Payment notification sent for payment: {}", payment.getId());

        // If notification is successful, proceed to next handler
        if (nextHandler != null) {
            LOGGER.info("Payment notification successful, proceeding to next handler");
            nextHandler.process(payment);
        }
    }
}