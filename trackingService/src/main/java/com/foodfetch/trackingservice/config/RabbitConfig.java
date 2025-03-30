package com.foodfetch.trackingservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

  // Tracking Queue Name
  @Value("${rabbitmq.queue.tracking.name}")
  private String trackingQueue;

  // Exchange Name
  @Value("${rabbitmq.exchange.name}")
  private String exchange;

  // Routing Key
  @Value("${rabbitmq.routing.key.tracking}")
  private String trackingRoutingKey;

  // Tracking Updated Routing Key
  @Value("${rabbitmq.routing.key.tracking.completed}")
  private String trackingCompletedRoutingKey;

  // Tracking Events
  @Bean
  public Queue trackingQueue() {
    return new Queue(trackingQueue);
  }

  // Topic Exchange
  @Bean
  public TopicExchange exchange() {
    return new TopicExchange(exchange);
  }

  // Binding
  @Bean
  public Binding trackingBinding() {
    return BindingBuilder.bind(trackingQueue()).to(exchange()).with(trackingRoutingKey);
  }

  // Message Converter
  @Bean
  public MessageConverter converter() {
    return new Jackson2JsonMessageConverter();
  }

  // Template
  @Bean
  public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(converter());
    return rabbitTemplate;
  }

}