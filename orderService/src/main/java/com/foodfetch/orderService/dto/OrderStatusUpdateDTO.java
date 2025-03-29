package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.Data;

/**
 * OrderStatusUpdateDTO is a Data Transfer Object for updating the status of an order.
 * It contains the new status and an optional reason for the status change.
 */
@Data
public class OrderStatusUpdateDTO {
    private OrderStatus status;
    private String reason;
}
