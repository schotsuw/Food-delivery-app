package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderItem;
import lombok.Data;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * OrderRequestDTO is a Data Transfer Object for order requests.
 * It contains the necessary information to create an order.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    private String restaurantName;
    @Getter
    private List<OrderItem> items;
    private String paymentMethod;
    private String deliveryAddress;
}
