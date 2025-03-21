package com.foodfetch.backend.dto;

import com.foodfetch.backend.model.OrderItem;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class OrderRequestDTO {
    private String restaurantName;
    @Getter
    private double amount;
    @Getter
    private List<OrderItem> items;
    private String paymentMethod;
    private String deliveryAddress;

    public String getRestaurant() {
        return restaurantName;
    }

}
