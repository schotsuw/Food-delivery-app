package com.foodfetch.notificationservice.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    private String orderId;
    // We'll use String for orderStatus since we don't have access to the OrderStatus enum from order service
    private String orderStatus;
    private String restaurantId;
    private Double amount;

    @Getter
    private Double totalAmount;

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