package com.foodfetch.backend.Factory;

import com.foodfetch.backend.model.OrderEntity;
import java.util.List;

public interface OrderFactory {
    OrderEntity createOrder(String restaurantId, double amount, List<String> items);
}
