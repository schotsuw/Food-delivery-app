package com.foodfetch.backend.Factory;

import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.model.OrderItem;

import java.util.List;

public interface OrderFactory {
    OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items);
}
