package com.foodfetch.orderService.controller;

import com.foodfetch.orderService.model.Restaurant;
import com.foodfetch.orderService.Service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RestaurantController handles HTTP requests related to restaurant operations.
 */
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    /**
     * Constructor for RestaurantController
     *
     * @param restaurantService Service to handle restaurant-related operations
     */
    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /**
     * Endpoint to get all restaurants
     *
     * @return List of Restaurant
     */
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    /**
     * Endpoint to get a specific restaurant by its ID
     *
     * @param id ID of the restaurant
     * @return Restaurant
     */
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }
}