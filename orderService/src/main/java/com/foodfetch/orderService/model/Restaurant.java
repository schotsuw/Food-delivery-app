package com.foodfetch.orderService.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Restaurant represents a restaurant in the system.
 * It contains the necessary information about the restaurant.
 */
@Data
@Document(collection = "restaurants") // MongoDB collection name
public class Restaurant {
    @Id
    private String id;
    private String name;
    private String imageUrl;
    private String cuisineType;
    private String address;
    private double rating;
    private int deliveryTime; // in minutes
    private double deliveryFee;
    private boolean isOpen;
}
