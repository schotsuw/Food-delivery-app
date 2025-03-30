package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderItem;
import lombok.Data;
import lombok.Getter;

import java.util.List;

/**
 * OrderRequestDTO is a Data Transfer Object for order requests.
 * It contains the necessary information to create an order.
 */
@Data
public class OrderRequestDTO {
    private String restaurantName;
    @Getter
    private List<OrderItem> items;
    private String paymentMethod;
    private String deliveryAddress;
}
