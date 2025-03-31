package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderStatusUpdateDTO is a Data Transfer Object for updating the status of an order.
 * It contains the new status and an optional reason for the status change.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateDTO {
    private OrderStatus status;
    private String reason;
}
