package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * RabbitMQOrderSender is responsible for sending order-related events to RabbitMQ.
 * It handles events such as order status changes, payment processing, and notifications.
 */
@Service
public class RabbitMQOrderSender {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQOrderSender.class);

    // RabbitTemplate is used to send messages to RabbitMQ
    private final RabbitTemplate rabbitTemplate;

    // Configuration values for RabbitMQ
    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key.order}")
    private String orderRoutingKey;

    @Value("${rabbitmq.routing.key.payment}")
    private String paymentRoutingKey;

    @Value("${rabbitmq.routing.key.notification}")
    private String notificationRoutingKey;

    @Value("${rabbitmq.routing.key.tracking}")
    private String trackingRoutingKey;

    /**
     * Constructor for RabbitMQOrderSender
     *
     * @param rabbitTemplate RabbitTemplate to send messages
     */
    public RabbitMQOrderSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Sends an order status change event to RabbitMQ
     *
     * @param order The order entity containing order details
     */
    public void sendOrderStatusChangeEvent(OrderEntity order) {
        // Log the order status change event
        logger.info("Sending order status change event for order: {}", order.getId());

        // Create an OrderEvent object to encapsulate order details
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getTotalAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setRestaurantLat(order.getRestaurantLatitude());
        event.setRestaurantLong(order.getRestaurantLongitude());
        event.setCustomerLat(order.getCustomerLatitude());
        event.setCustomerLong(order.getCustomerLongitude());

        // Set event type based on order status
        switch (order.getStatus()) {
            case CREATED:
                event.setEventType(OrderEvent.ORDER_CREATED);
                break;
            case CONFIRMED:
                event.setEventType(OrderEvent.ORDER_CONFIRMED);
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

        // For CONFIRMED orders, also send to tracking queue
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            logger.info("Sending confirmed order to tracking service: {}", order.getId());
            rabbitTemplate.convertAndSend(exchange, trackingRoutingKey, event);
        }
    }

    /**
     * Sends a payment processing event when an order is confirmed
     *
     * @param order The order entity containing order details
     */
    public void sendPaymentProcessingEvent(OrderEntity order) {
        logger.info("Sending payment processing event for order: {}", order.getId());

        // Create an OrderEvent object to encapsulate order details
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getTotalAmount());
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
     *
     * @param order The order entity containing order details
     */
    public void sendPaymentRefundEvent(OrderEntity order) {
        logger.info("Sending payment refund event for order: {}", order.getId());

        // Create an OrderEvent object to encapsulate order details
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getTotalAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setEventType(OrderEvent.ORDER_CANCELLED);

        // Send to payment queue
        rabbitTemplate.convertAndSend(exchange, paymentRoutingKey, event);
    }

    /**
     * Sends a notification event when an order is confirmed or updated
     *
     * @param order The order entity containing order details
     */
    public void sendNotificationEvent(OrderEntity order) {
        logger.info("Sending notification event for order: {}", order.getId());

        // Create an OrderEvent object to encapsulate order details
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setCustomerId(order.getCustomerId());
        event.setTotalAmount(order.getTotalAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setRestaurantLat(order.getRestaurantLatitude());
        event.setRestaurantLong(order.getRestaurantLongitude());
        event.setCustomerLat(order.getCustomerLatitude());
        event.setCustomerLong(order.getCustomerLongitude());

        // Map the order status to appropriate notification type
        String notificationType = mapToNotificationType(order.getStatus());
        event.setEventType(notificationType);

        // Send to notification queue
        rabbitTemplate.convertAndSend(exchange, notificationRoutingKey, event);
    }

    /**
     * Sends a tracking event when an order is confirmed
     *
     * @param order The order entity containing order details
     */
    public void sendTrackingEvent(OrderEntity order) {
        logger.info("Sending tracking event for order: {}", order.getId());

        // Create an OrderEvent object specifically for tracking
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setOrderStatus(order.getStatus());
        event.setRestaurantId(order.getRestaurantId());
        event.setTotalAmount(order.getTotalAmount());
        event.setTimestamp(LocalDateTime.now());
        event.setCustomerId(order.getCustomerId());

        // Set location data
        event.setRestaurantLat(order.getRestaurantLatitude());
        event.setRestaurantLong(order.getRestaurantLongitude());
        event.setCustomerLat(order.getCustomerLatitude());
        event.setCustomerLong(order.getCustomerLongitude());

        // Set event type
        event.setEventType(OrderEvent.ORDER_CONFIRMED);

        // Send to tracking queue
        rabbitTemplate.convertAndSend(exchange, trackingRoutingKey, event);
    }

    /**
     * Maps order status to notification type
     *
     * @param status The order status
     * @return The corresponding notification type
     */

    private String mapToNotificationType(OrderStatus status) {
        switch (status) {
            case CREATED:
                return "order-created";
            case CONFIRMED:
                return "order-confirmed"; // always assume that the payment is successful
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