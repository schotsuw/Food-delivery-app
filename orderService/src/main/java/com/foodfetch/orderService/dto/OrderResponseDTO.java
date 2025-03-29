package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * OrderResponseDTO is a Data Transfer Object for order responses.
 * It contains the necessary information to represent an order.
 */
@Data
public class OrderResponseDTO {
    private String id;
    private String restaurantName;
    private OrderStatus status;
    private double totalAmount;
    private String deliveryAddress;
    private LocalDateTime estimatedDeliveryTime;
}