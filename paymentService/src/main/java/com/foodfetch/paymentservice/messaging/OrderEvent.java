package com.foodfetch.paymentservice.messaging;

import lombok.*;

import java.io.Serializable;

/**
 * OrderEvent is a class that represents an event related to an order.
 * It contains information about the order ID, status, total amount, event type, customer ID, restaurant ID, and payment method.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    private String orderId;
    private String orderStatus;
    private Double totalAmount;
    private String eventType;
    private Long customerId;
    private String restaurantId;
    private String paymentMethod;


    public static final String ORDER_CREATED = "ORDER_CREATED";
    public static final String ORDER_CONFIRMED = "ORDER_CONFIRMED";
    public static final String ORDER_UPDATED = "ORDER_UPDATED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String ORDER_COMPLETED = "ORDER_COMPLETED";
}