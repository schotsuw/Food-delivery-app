// RestaurantService.java
package com.foodfetch.orderService.Service;

import com.foodfetch.orderService.model.Restaurant;
import com.foodfetch.orderService.Repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * RestaurantService is a service class that provides methods to interact with restaurant data.
 * It uses RestaurantRepository to perform CRUD operations on restaurants.
 */
@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;

    /**
     * Constructor for RestaurantService
     *
     * @param restaurantRepository Repository to handle restaurant operations
     */
    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    /**
     * Retrieves all restaurants from the database.
     *
     * @return List of Restaurant
     */
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    /**
     * Retrieves a specific restaurant by its ID.
     *
     * @param id ID of the restaurant
     * @return Restaurant
     */
    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }
}