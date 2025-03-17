package com.foodfetch.backend.Service;

import com.foodfetch.backend.Factory.FactoryRegistry;
import com.foodfetch.backend.Factory.OrderFactory;
import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.model.Restaurant;
import com.foodfetch.backend.Repository.OrderRepository;
import com.foodfetch.backend.Repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final FactoryRegistry factoryRegistry;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(FactoryRegistry factoryRegistry, RestaurantRepository restaurantRepository, OrderRepository orderRepository) {
        this.factoryRegistry = factoryRegistry;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
    }

    public OrderEntity createOrder(String restaurantName, double amount, List<String> items) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findByName(restaurantName);
        if (restaurantOpt.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found: " + restaurantName);
        }

        Restaurant restaurant = restaurantOpt.get();
        String restaurantId = restaurant.getId();

        // Use factory to create an order
        OrderFactory factory = factoryRegistry.getFactory(restaurantName);
        if (factory == null) {
            throw new IllegalArgumentException("No factory found for restaurant: " + restaurantName);
        }

        OrderEntity orderEntity = factory.createOrder(restaurantId, amount, items);
        return orderRepository.save(orderEntity);
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
}
