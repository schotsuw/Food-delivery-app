package com.foodfetch.backend.dto;

import com.foodfetch.backend.model.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponseDTO {
    private String id;
    private String restaurantName;
    private OrderStatus status;
    private double totalAmount;
    private String deliveryAddress;
    private LocalDateTime estimatedDeliveryTime;
}