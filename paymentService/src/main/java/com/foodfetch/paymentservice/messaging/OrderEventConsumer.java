package com.foodfetch.paymentservice.messaging;

import com.foodfetch.paymentservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * OrderEventConsumer listens for order events from RabbitMQ and processes them.
 * It handles events such as order creation and cancellation.
 */
@Component
public class OrderEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderEventConsumer.class);

    /**
     * PaymentService instance to handle payment-related operations.
     */
    private final PaymentService paymentService;

    /**
     * Constructor for OrderEventConsumer
     *
     * @param paymentService Service to handle payment-related operations
     */
    public OrderEventConsumer(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Listens for order events from RabbitMQ and processes them.
     *
     * @param orderEvent The order event received from RabbitMQ
     */
    @RabbitListener(queues = "${rabbitmq.queue.payment.name}")
    public void consumeOrderEvent(OrderEvent orderEvent) {
        LOGGER.info("Order event received -> {}", orderEvent);

        // Process different types of order events
        if (OrderEvent.ORDER_CREATED.equals(orderEvent.getEventType())) {
            paymentService.processInitialPayment(orderEvent);
        }
        else if (OrderEvent.ORDER_CANCELLED.equals(orderEvent.getEventType())) {
            paymentService.processRefund(orderEvent);
        }
    }
}