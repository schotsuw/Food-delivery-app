package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;

import java.util.List;

public class WendysOrderFactory implements OrderFactory {
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items) {
        return new OrderEntity(restaurantId, amount, items);
    }
}

