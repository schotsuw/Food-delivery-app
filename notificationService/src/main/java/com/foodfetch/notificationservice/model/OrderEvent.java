package com.foodfetch.notificationservice.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.*;

/**
 * OrderEvent is a class that represents an event related to an order.
 * It contains information about the order ID, status, restaurant ID, amount, event type, timestamp, customer ID, and payment method.
 * This class is used to track the events that occur in the order lifecycle.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    @Setter
    @Getter
    private String orderId;
    private OrderStatus orderStatus;
    private String restaurantId;
    private Double totalAmount;

    private String eventType;
    private LocalDateTime timestamp;
    private String customerId;
    private String paymentMethod;

    // Common event types as constants
    public static final String ORDER_CREATED = "ORDER_CREATED";
    public static final String ORDER_CONFIRMED = "ORDER_CONFIRMED";
    public static final String ORDER_UPDATED = "ORDER_UPDATED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String ORDER_COMPLETED = "ORDER_COMPLETED";
}