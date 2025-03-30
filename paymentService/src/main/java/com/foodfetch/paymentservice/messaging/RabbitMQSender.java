package com.foodfetch.paymentservice.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * RabbitMQSender is responsible for sending messages to RabbitMQ.
 * It handles events related to payment processing.
 */
@Service
public class RabbitMQSender {

    // RabbitTemplate is used to send messages to RabbitMQ
    private final RabbitTemplate rabbitTemplate;

    // Configuration values for RabbitMQ
    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    // Constructor for RabbitMQSender
    public RabbitMQSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Sends a payment event to RabbitMQ
     *
     * @param event The payment event to be sent
     */
    public void sendPaymentEvent(Object event){
        rabbitTemplate.convertAndSend(exchange, paymentRoutingKey, event);
    }
}
