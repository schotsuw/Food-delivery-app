package com.foodfetch.paymentservice.messaging;

import com.foodfetch.paymentservice.model.OrderEvent;
import com.foodfetch.paymentservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final PaymentService paymentService;

    public OrderEventConsumer(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @RabbitListener(queues = "${rabbitmq.queue.order.name}")
    public void consumeOrderEvent(OrderEvent orderEvent) {
        LOGGER.info("Order event received -> {}", orderEvent);

        // Process different types of order events
        if (OrderEvent.ORDER_CREATED.equals(orderEvent.getEventType())) {
            paymentService.processInitialPayment(orderEvent);
        } else if (OrderEvent.ORDER_CANCELLED.equals(orderEvent.getEventType())) {
            paymentService.processRefund(orderEvent);
        }
    }
}