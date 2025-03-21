package com.foodfetch.backend.Factory;

import com.foodfetch.backend.model.OrderEntity;
import java.util.List;

public class WendysOrderFactory implements OrderFactory {
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<String> items) {
        return new OrderEntity(restaurantId, amount, items);
    }
}

