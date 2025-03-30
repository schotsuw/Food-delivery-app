package com.foodfetch.trackingservice.messaging;

import org.springframework.stereotype.Component;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

import com.foodfetch.trackingservice.model.Delivery;
import com.foodfetch.trackingservice.service.TrackingService;

@Component
public class OrderEventListener {
  private final TrackingService trackingService;

  public OrderEventListener(TrackingService trackingService) {
    this.trackingService = trackingService;
  }

  @RabbitListener(queues = "${rabbitmq.queue.tracking.name}")
  public void handleOrderEvent(OrderEvent orderEvent) {
    if (orderEvent.getEventType().equals(OrderEvent.ORDER_CONFIRMED)) {
      // Create Delivery Event
      Delivery delivery = new Delivery();
      delivery.setOrderId(orderEvent.getOrderId());
      delivery.setStatus("PREPARING");
      delivery.setRestaurantLatitude(orderEvent.getRestaurantLat());
      delivery.setRestaurantLongitude(orderEvent.getRestaurantLong());
      delivery.setCustomerLatitude(orderEvent.getCustomerLat());
      delivery.setCustomerLongitude(orderEvent.getCustomerLong());

      trackingService.track(delivery);
    }
  }

}