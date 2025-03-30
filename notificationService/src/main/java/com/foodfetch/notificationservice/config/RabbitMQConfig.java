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

/**
 * RabbitMQConfig is a configuration class for setting up RabbitMQ components.
 * It defines the queues, exchanges, and bindings required for the notification service.
 */
@Configuration
public class RabbitMQConfig {

    // Configuration values for RabbitMQ
    @Value("${rabbitmq.queue.notification.name}")
    private String notificationQueue;

    // The name of the exchange to which the queues will be bound
    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    // The routing key for the notification queue
    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    // Custom notification queues
    private static final String ORDER_NOTIFICATION_QUEUE = "order.notifications";
    private static final String DELIVERY_NOTIFICATION_QUEUE = "delivery.notifications";
    private static final String ORDER_ROUTING_KEY = "order.#";
    private static final String DELIVERY_ROUTING_KEY = "delivery.#";

    /**
     * Creates a TopicExchange bean for RabbitMQ.
     * This exchange will be used to route messages to the appropriate queues based on routing keys.
     *
     * @return TopicExchange
     */
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    /**
     * Creates a Queue bean for the main notification queue.
     * This queue will be used to receive notifications from the order service.
     *
     * @return Queue
     */
    @Bean
    public Queue mainNotificationQueue() {
        return new Queue(notificationQueue, true);
    }

    /**
     * Creates a Queue bean for the order notification queue.
     * This queue will be used to receive order-related notifications.
     *
     * @return Queue
     */
    @Bean
    public Queue orderNotificationQueue() {
        return new Queue(ORDER_NOTIFICATION_QUEUE, true);
    }

    /**
     * Creates a Queue bean for the delivery notification queue.
     * This queue will be used to receive delivery-related notifications.
     *
     * @return Queue
     */
    @Bean
    public Queue deliveryNotificationQueue() {
        return new Queue(DELIVERY_NOTIFICATION_QUEUE, true);
    }

    /**
     * Creates a Binding between the main notification queue and the exchange.
     * This binding uses the notification routing key to route messages to the queue.
     *
     * @return Binding
     */
    @Bean
    public Binding mainNotificationBinding() {
        return BindingBuilder
                .bind(mainNotificationQueue())
                .to(exchange())
                .with(notificationRoutingKey);
    }

    /**
     * Creates a Binding between the order notification queue and the exchange.
     * This binding uses the order routing key to route messages to the queue.
     *
     * @return Binding
     */
    @Bean
    public Binding orderBinding() {
        return BindingBuilder
                .bind(orderNotificationQueue())
                .to(exchange())
                .with(ORDER_ROUTING_KEY);
    }

    /**
     * Creates a Binding between the delivery notification queue and the exchange.
     * This binding uses the delivery routing key to route messages to the queue.
     *
     * @return Binding
     */
    @Bean
    public Binding deliveryBinding() {
        return BindingBuilder
                .bind(deliveryNotificationQueue())
                .to(exchange())
                .with(DELIVERY_ROUTING_KEY);
    }

    /**
     * Creates a MessageConverter bean for converting messages to and from JSON format.
     * This converter uses Jackson's ObjectMapper for serialization and deserialization.
     * Basically, this is used to convert the message to JSON format
     *
     * @return MessageConverter
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();

        // Configure the ObjectMapper to handle Java 8 date/time types
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Register the JavaTimeModule to handle Java 8 date/time types
        objectMapper.registerModule(new JavaTimeModule());

        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);

        // Create class mapping for OrderEvent
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();

        // Set the default type to be used for deserialization
        Map<String, Class<?>> idClassMapping = new HashMap<>();

        // Add the mapping for OrderEvent
        idClassMapping.put("com.foodfetch.orderService.messaging.OrderEvent",
                com.foodfetch.notificationservice.model.OrderEvent.class);

        // Add the mapping for DeliveryEvent
        typeMapper.setIdClassMapping(idClassMapping);

        // Set the type mapper to the converter
        converter.setJavaTypeMapper(typeMapper);

        return converter;
    }

    /**
     * Creates a MessageListenerAdapter bean for handling incoming messages.
     * This adapter uses the NotificationReceiver class to process messages.
     *
     * @param receiver The NotificationReceiver instance
     * @return MessageListenerAdapter
     */
    @Bean
    public MessageListenerAdapter listenerAdapter(NotificationReceiver receiver) {
        // Create a MessageListenerAdapter that uses the NotificationReceiver to handle messages
        MessageListenerAdapter adapter = new MessageListenerAdapter(receiver, "receiveMessage");

        // Set the default listener method to be used for message handling
        adapter.setMessageConverter(jsonMessageConverter());
        return adapter;
    }

    /**
     * Creates a SimpleMessageListenerContainer bean for listening to messages from RabbitMQ.
     * This container uses the connection factory and message listener adapter to receive messages.
     *
     * @param connectionFactory The RabbitMQ connection factory
     * @param listenerAdapter   The message listener adapter
     * @return SimpleMessageListenerContainer
     */
    @Bean
    public SimpleMessageListenerContainer container(ConnectionFactory connectionFactory,
                                                    MessageListenerAdapter listenerAdapter) {
        // Create a SimpleMessageListenerContainer to listen for messages from RabbitMQ
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();

        // Set the connection factory and queue names for the container
        container.setConnectionFactory(connectionFactory);
        container.setQueueNames(notificationQueue, ORDER_NOTIFICATION_QUEUE, DELIVERY_NOTIFICATION_QUEUE);
        container.setMessageListener(listenerAdapter);
        return container;
    }
}
