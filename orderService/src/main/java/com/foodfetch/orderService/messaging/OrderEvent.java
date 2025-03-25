package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    private String orderId;
    private OrderStatus orderStatus;
    private String restaurantId;
    private Double amount;
    private String eventType;
    private LocalDateTime timestamp;
    private String customerId;
    private String paymentMethod;

    // Common event types as constants
    public static final String ORDER_CREATED = "ORDER_CREATED";
    public static final String ORDER_UPDATED = "ORDER_UPDATED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String ORDER_COMPLETED = "ORDER_COMPLETED";
}