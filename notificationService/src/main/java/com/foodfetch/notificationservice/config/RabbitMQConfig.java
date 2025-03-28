package com.foodfetch.notificationservice.config;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.foodfetch.notificationservice.messaging.NotificationReceiver;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue.notification.name}")
    private String notificationQueue;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    // Custom notification queues
    private static final String ORDER_NOTIFICATION_QUEUE = "order.notifications";
    private static final String DELIVERY_NOTIFICATION_QUEUE = "delivery.notifications";
    private static final String ORDER_ROUTING_KEY = "order.#";
    private static final String DELIVERY_ROUTING_KEY = "delivery.#";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Queue mainNotificationQueue() {
        return new Queue(notificationQueue, true);
    }

    @Bean
    public Queue orderNotificationQueue() {
        return new Queue(ORDER_NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Queue deliveryNotificationQueue() {
        return new Queue(DELIVERY_NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Binding mainNotificationBinding() {
        return BindingBuilder
                .bind(mainNotificationQueue())
                .to(exchange())
                .with(notificationRoutingKey);
    }

    @Bean
    public Binding orderBinding() {
        return BindingBuilder
                .bind(orderNotificationQueue())
                .to(exchange())
                .with(ORDER_ROUTING_KEY);
    }

    @Bean
    public Binding deliveryBinding() {
        return BindingBuilder
                .bind(deliveryNotificationQueue())
                .to(exchange())
                .with(DELIVERY_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Register the JavaTimeModule to handle Java 8 date/time types
        objectMapper.registerModule(new JavaTimeModule());

        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);

        // Create class mapping for OrderEvent
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        Map<String, Class<?>> idClassMapping = new HashMap<>();
        idClassMapping.put("com.foodfetch.orderService.messaging.OrderEvent",
                com.foodfetch.notificationservice.model.OrderEvent.class);

        typeMapper.setIdClassMapping(idClassMapping);
        converter.setJavaTypeMapper(typeMapper);

        return converter;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(NotificationReceiver receiver) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(receiver, "receiveMessage");
        adapter.setMessageConverter(jsonMessageConverter());
        return adapter;
    }

    @Bean
    public SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
                                                    MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(notificationQueue, ORDER_NOTIFICATION_QUEUE, DELIVERY_NOTIFICATION_QUEUE);
        container.setMessageListener(listenerAdapter);
        return container;
    }
}