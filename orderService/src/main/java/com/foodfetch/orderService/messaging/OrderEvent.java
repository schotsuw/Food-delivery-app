package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
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
    // Add getters and setters for totalAmount
    @Getter
    private Double totalAmount; // Add this field
    private String eventType;
    private LocalDateTime timestamp;
    private String customerId;
    private String paymentMethod;

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
        // Also set amount to keep both in sync
        this.amount = totalAmount;
    }
    // Common event types as constants
    public static final String ORDER_CREATED = "ORDER_CREATED";
    public static final String ORDER_UPDATED = "ORDER_UPDATED";
    public static final String ORDER_CANCELLED = "ORDER_CANCELLED";
    public static final String ORDER_COMPLETED = "ORDER_COMPLETED";
}