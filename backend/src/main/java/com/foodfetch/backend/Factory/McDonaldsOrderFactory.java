package com.foodfetch.backend.Factory;

import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.model.OrderItem;
import java.util.List;

public class McDonaldsOrderFactory implements OrderFactory {
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items) {
        return new OrderEntity(restaurantId, amount, items);
    }
}

