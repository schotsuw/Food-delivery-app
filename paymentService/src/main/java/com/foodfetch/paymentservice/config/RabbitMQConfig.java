package com.foodfetch.paymentservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Queue;

/**
 * RabbitMQConfig is responsible for configuring RabbitMQ components such as queues, exchanges, and bindings.
 * It uses Spring's AMQP library to facilitate message communication between microservices.
 */
@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.order.name}")
    private String orderQueue;

    @Value("${rabbitmq.queue.payment.name}")
    private String paymentQueue;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.order}")
    private String orderRoutingKey;

    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    //Queue for order events
    @Bean
    public Queue orderQueue() {
        return new Queue(orderQueue);
    }

    // Queue for payment events
    @Bean
    public Queue paymentQueue() {
        return new Queue(paymentQueue);
    }

    // Topic exchange
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    /*
     * Binding between order queue and exchange
     * This binding allows messages sent to the order queue to be routed to the exchange
     */
    @Bean
    public Binding orderBinding() {
        return BindingBuilder
                .bind(orderQueue())
                .to(exchange())
                .with(orderRoutingKey);
    }

    /*
     * Binding between payment queue and exchange
     * This binding allows messages sent to the payment queue to be routed to the exchange
     */
    @Bean
    public Binding paymentBinding() {
        return BindingBuilder
                .bind(paymentQueue())
                .to(exchange())
                .with(paymentRoutingKey);
    }

    /*
     * Message converter for converting messages to and from JSON format
     */
    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }

    /*
     * RabbitTemplate is used to send messages to RabbitMQ.
     * It uses the connection factory and message converter defined above.
     */
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;
    }


}
