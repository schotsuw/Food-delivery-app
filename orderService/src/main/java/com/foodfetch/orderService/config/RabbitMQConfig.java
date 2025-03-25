package com.foodfetch.orderService.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.order.name}")
    private String orderQueue;

    @Value("${rabbitmq.queue.payment.name}")
    private String paymentQueue;

    @Value("${rabbitmq.queue.notification.name}")
    private String notificationQueue;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.order}")
    private String orderRoutingKey;

    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

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

    // Topic exchange
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

    // Message converter
    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }

    // Configure RabbitTemplate
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;
    }
}