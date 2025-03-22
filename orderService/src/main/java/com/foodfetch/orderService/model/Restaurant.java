package com.foodfetch.orderService.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "restaurants")
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
