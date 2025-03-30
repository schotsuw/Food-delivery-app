package com.foodfetch.orderService.config;

import java.util.Queue;

import javax.naming.Binding;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
When an order is created, updated, or cancelled in OrderService, the service uses RabbitMQOrderSender to:

Create an OrderEvent object with the relevant information
Send that event to the appropriate queue using the RabbitTemplate
Other services (Payment, Notification) listen to these queues and react accordingly

For example, when a new order is created:

OrderService publishes an ORDER_CREATED event
The Payment Service picks this up from the payment queue and processes payment
The Notification Service picks it up from the notification queue and sends a confirmation to the customer
This is a simplified overview of how RabbitMQ can be used in a microservices architecture to facilitate communication between services.
 */

@Configuration
public class RabbitMQConfig {

    // Configuration values for RabbitMQ queues and exchanges
    @Value("${rabbitmq.queue.order.name}")
    private String orderQueue;

    // Payment queue for payment events
    @Value("${rabbitmq.queue.payment.name}")
    private String paymentQueue;

    // Notification queue for notification events
    @Value("${rabbitmq.queue.notification.name}")
    private String notificationQueue;

    // Send Events to Track
    @Value("${rabbitmq.queue.tracking.name}")
    private String trackingQueue;

    // Receive Tracking Events
    @Value("${rabbitmq.queue.order.tracking.name}")
    private String orderTrackingQueue;

    // Exchange name for RabbitMQ
    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    // Routing keys for different events
    @Value("${rabbitmq.routing.key.order}")
    private String orderRoutingKey;

    // Routing key for payment events
    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    // Routing key for notification events
    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    // Routing key for tracking events
    @Value("${rabbitmq.routing.key.tracking}")
    private String trackingRoutingKey;

    // Routing Key for Completed Tracking Events
    @Value("${rabbitmq.routing.key.tracking.completed}")
    private String trackingCompletedRoutingKey;

    // Order queue for order events
    @Bean
    public Queue orderQueue() {
        return new Queue(orderQueue);
    }

    // Payment queue for payment events
    @Bean
    public Queue paymentQueue() {
        return new Queue(paymentQueue);
    }

    // Notification queue for notification events
    @Bean
    public Queue notificationQueue() {
        return new Queue(notificationQueue);
    }

    // Order Tracking Events
    @Bean
    public Queue orderTrackingQueue() {
        return new Queue(orderTrackingQueue);
    }

    // Topic exchange: An exchange receives messages from producers and routes them to queues.
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    // Binding between order queue and exchange
    @Bean
    public Binding orderBinding() {
        return BindingBuilder
                .bind(orderQueue())
                .to(exchange())
                .with(orderRoutingKey);
    }

    // Binding between payment queue and exchange
    @Bean
    public Binding paymentBinding() {
        return BindingBuilder
                .bind(paymentQueue())
                .to(exchange())
                .with(paymentRoutingKey);
    }

    // Binding between notification queue and exchange
    @Bean
    public Binding notificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(exchange())
                .with(notificationRoutingKey);
    }

    // Order and Tracking Binding
    @Bean
    public Binding orderTrackingBinding() {
        return BindingBuilder
                .bind(orderTrackingQueue())
                .to(exchange())
                .with(trackingCompletedRoutingKey);
    }

    // Message converter: convert Java objects to JSON (serialization) and vice versa (deserialization)
    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }

    // Configure RabbitTemplate: what an application uses to send messages to RabbitMQ
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;
    }
}