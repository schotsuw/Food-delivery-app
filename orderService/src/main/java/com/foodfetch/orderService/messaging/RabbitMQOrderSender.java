package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RabbitMQOrderSender {
    private static final Logger logger = LoggerFactory.getLogger(RabbitMQOrderSender.class);

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.order}")
    private String orderRoutingKey;

    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    public RabbitMQOrderSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Sends an order event when an order status changes
     */
    public void sendOrderStatusChangeEvent(OrderEntity order) {
        logger.info("Sending order status change event for order: {}", order.getId());

        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setAmount(order.getAmount());
        event.setTimestamp(LocalDateTime.now());

        // Set event type based on order status
        switch (order.getStatus()) {
            case CREATED:
                event.setEventType(OrderEvent.ORDER_CREATED);
                break;
            case CANCELLED:
                event.setEventType(OrderEvent.ORDER_CANCELLED);
                break;
            case DELIVERED:
                event.setEventType(OrderEvent.ORDER_COMPLETED);
                break;
            default:
                event.setEventType(OrderEvent.ORDER_UPDATED);
        }

        // Send to order queue
        rabbitTemplate.convertAndSend(exchange, orderRoutingKey, event);
    }

    /**
     * Sends a payment request event when an order is confirmed
     */
    public void sendPaymentProcessingEvent(OrderEntity order) {
        logger.info("Sending payment processing event for order: {}", order.getId());

        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setEventType(OrderEvent.ORDER_CREATED);

        // Include payment information if available
        if (order.getPaymentDetails() != null) {
            event.setPaymentMethod(order.getPaymentDetails().getPaymentMethod());
        }

        // Send to payment queue
        rabbitTemplate.convertAndSend(exchange, paymentRoutingKey, event);
    }

    /**
     * Sends a payment refund event when an order is cancelled
     */
    public void sendPaymentRefundEvent(OrderEntity order) {
        logger.info("Sending payment refund event for order: {}", order.getId());

        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setEventType(OrderEvent.ORDER_CANCELLED);

        // Send to payment queue
        rabbitTemplate.convertAndSend(exchange, paymentRoutingKey, event);
    }

    /**
     * Sends a notification event based on order status changes
     */
    public void sendNotificationEvent(OrderEntity order) {
        logger.info("Sending notification event for order: {}", order.getId());

        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setCustomerId(order.getCustomerId());
        event.setAmount(order.getAmount());
        event.setTimestamp(LocalDateTime.now());

        // Map the order status to appropriate notification type
        String notificationType = mapToNotificationType(order.getStatus());
        event.setEventType(notificationType);

        // Send to notification queue
        rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, event);
    }

    /**
     * Maps OrderStatus to notification event type
     */
    // Since we're assuming payments always succeed in this implementation,
// we map both CREATED and CONFIRMED statuses to the same notification
// to avoid sending users multiple notifications in rapid succession
    private String mapToNotificationType(OrderStatus status) {
        switch (status) {
            case CREATED:
            case CONFIRMED:
                return "order-confirmed";
            case PREPARING:
                return "order-preparation";
            case IN_TRANSIT:
                return "delivery-update";
            case DELIVERED:
                return "order-arrival";
            default:
                return "order-status-update";
        }
    }
}