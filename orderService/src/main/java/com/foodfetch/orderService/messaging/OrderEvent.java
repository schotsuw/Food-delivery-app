package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * OrderEvent is a class that represents an event related to an order.
 * It contains information about the order ID, status, restaurant ID, amount, event type, timestamp, customer ID, and payment method.
 */
@Data // Data annotation for automatic generation of getters, setters, equals, hashCode, and toString methods
@NoArgsConstructor // No-args constructor for deserialization
@AllArgsConstructor // All-args constructor for easy instantiation
public class OrderEvent implements Serializable {
    private String orderId;
    private OrderStatus orderStatus;
    private String restaurantId;

    @Setter
    @Getter
    private Double totalAmount;
    private String eventType;
    private LocalDateTime timestamp;
    private String customerId;
    private String paymentMethod;

    @Getter
    @Setter
    private double restaurantLat;
    private double restaurantLong;
    private double customerLat;
    private double customerLong;

    public static final String ORDER_CREATED = "ORDER_CREATED";
    public static final String ORDER_CONFIRMED = "ORDER_CONFIRMED";
    public static final String ORDER_UPDATED = "ORDER_UPDATED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String ORDER_COMPLETED = "ORDER_COMPLETED";
}