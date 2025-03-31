package com.foodfetch.orderService.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.foodfetch.orderService.Service.OrderService;

@Component
public class TrackingEventConsumer {

  private final OrderService orderService;

  public TrackingEventConsumer(OrderService orderService) {
    this.orderService = orderService;
  }

  @RabbitListener(queues = "${rabbitmq.queue.order.tracking.name}")
  public void handleTrackingEvent(TrackingEvent event) {
    System.out.println("Received tracking event: " + event);
    orderService.completeOrder(event.getOrderId());
  }
}
