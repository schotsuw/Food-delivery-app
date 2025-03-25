package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderItem;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class OrderRequestDTO {
    private String restaurantName;
    @Getter
    private List<OrderItem> items;
    private String paymentMethod;
    private String deliveryAddress;
}
