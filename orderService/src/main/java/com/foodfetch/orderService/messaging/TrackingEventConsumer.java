package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.foodfetch.orderService.Service.OrderService;

import java.time.LocalDateTime;

@Component
public class TrackingEventConsumer {

  private final OrderService orderService;

  private static final Logger logger = LoggerFactory.getLogger(TrackingEventConsumer.class);

  public TrackingEventConsumer(OrderService orderService) {
    this.orderService = orderService;
  }

  @RabbitListener(queues = "${rabbitmq.queue.order.tracking.name}")
  public void handleTrackingEvent(TrackingEvent event) {
    logger.info("Received tracking event: {}", event);

    String status = event.getStatus();
    String notificationType = null;

    // Map tracking status to notification type
    switch (status) {
      case "PREPARING":
        notificationType = "order-preparation";
        break;
      case "IN_TRANSIT":
        notificationType = "order-in-transit";
        break;
      case "DELIVERED":
        notificationType = "order-arrival";
        break;
      default:
        notificationType = "order-status-update";
    }

    // Only update to DELIVERED status when it's actually delivered
    if ("DELIVERED".equals(status)) {
      // Update the order status in the database but don't send a notification from here
      // as the TrackingService already sent one
      orderService.completeOrder(event.getOrderId());
      // Don't send a second notification since the TrackingService already sent one
    } else {
      // Existing code for other statuses...
      OrderEntity order = orderService.getOrderById(event.getOrderId());
      if (order != null) {
        // Send notification with the mapped type
        OrderEvent notificationEvent = new OrderEvent();
        notificationEvent.setOrderId(order.getId());
        notificationEvent.setEventType(notificationType);

        // Set the status to match the event
        switch (status) {
          case "PREPARING":
            notificationEvent.setOrderStatus(com.foodfetch.orderService.model.OrderStatus.PREPARING);
            break;
          case "IN_TRANSIT":
            notificationEvent.setOrderStatus(com.foodfetch.orderService.model.OrderStatus.IN_TRANSIT);
            break;
          default:
            notificationEvent.setOrderStatus(order.getStatus());
        }

        notificationEvent.setTimestamp(LocalDateTime.now());
        // Send notification
        orderService.sendNotificationForEvent(notificationEvent);
      }
    }
  }
}
