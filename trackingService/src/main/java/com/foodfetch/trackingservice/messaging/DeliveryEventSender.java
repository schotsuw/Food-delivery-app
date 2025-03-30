package com.foodfetch.trackingservice.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DeliveryEventSender {
  private final RabbitTemplate rabbitTemplate;

  @Value("${rabbitmq.exchange.name}")
  private String exchange;

  @Value("${rabbitmq.routing.key.tracking.completed}")
  private String deliveryRoutingKey;

  // Constructor
  public DeliveryEventSender(RabbitTemplate rabbitTemplate) {
    this.rabbitTemplate = rabbitTemplate;
  }

  // Event Sending
  public void sendDeliveryEvent(DeliveryEvent deliveryEvent) {
    rabbitTemplate.convertAndSend(exchange, deliveryRoutingKey, deliveryEvent);
  }

}
