package com.foodfetch.backend.factory;

import com.foodfetch.backend.model.OrderEntity;
import java.util.List;

public class McDonaldsOrderFactory implements OrderFactory {
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<String> items) {
        return new OrderEntity(restaurantId, amount, items);
    }
}

