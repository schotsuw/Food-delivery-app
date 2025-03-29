package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;

import java.util.List;

/**
 * OrderFactory is an interface for creating OrderEntity objects.
 * It provides a method to create an order with the specified restaurant ID, amount, and items.
 */
public interface OrderFactory {
    OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items);
}
