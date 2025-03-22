package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;

import java.util.List;

public interface OrderFactory {
    OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items);
}
