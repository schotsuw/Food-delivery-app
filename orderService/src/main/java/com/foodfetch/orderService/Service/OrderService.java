package com.foodfetch.orderService.Service;

import com.foodfetch.orderService.Factory.FactoryRegistry;
import com.foodfetch.orderService.Factory.OrderFactory;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;
import com.foodfetch.orderService.model.Restaurant;
import com.foodfetch.orderService.Repository.OrderRepository;
import com.foodfetch.orderService.Repository.RestaurantRepository;
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

    public OrderEntity createOrder(String restaurantName, double amount, List<OrderItem> items) {
        Optional<Restaurant> restaurantOpt = restaurantRepository.findByName(restaurantName);
        if (restaurantOpt.isEmpty()) {
            throw new IllegalArgumentException("Restaurant not found: " + restaurantName);
        }

        Restaurant restaurant = restaurantOpt.get();
        String restaurantId = restaurant.getId();

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

    // Add these methods to your OrderService class

    public OrderEntity getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<OrderEntity> getActiveOrders() {
        return orderRepository.findByStatusNotIn(List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED));
    }
}