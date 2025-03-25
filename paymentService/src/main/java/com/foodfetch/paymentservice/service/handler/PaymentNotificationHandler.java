package com.foodfetch.paymentservice.service.handler;

import com.foodfetch.paymentservice.messaging.RabbitMQSender;
import com.foodfetch.paymentservice.model.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentNotificationHandler implements PaymentHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentNotificationHandler.class);
    private PaymentHandler nextHandler;
    private final RabbitMQSender rabbitMQSender;

    public PaymentNotificationHandler(RabbitMQSender rabbitMQSender) {
        this.rabbitMQSender = rabbitMQSender;
    }

    @Override
    public void setNext(PaymentHandler handler) {
        this.nextHandler = handler;
    }

    @Override
    public void process(Payment payment) {
        LOGGER.info("Sending payment notification: {}", payment.getId());

        // In a real implementation, this might create and send a notification event

        // If notification is successful, proceed to next handler
        if (nextHandler != null) {
            nextHandler.process(payment);
        }
    }
}
