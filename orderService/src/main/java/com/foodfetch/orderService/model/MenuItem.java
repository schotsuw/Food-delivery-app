// MenuItem.java
package com.foodfetch.orderService.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MenuItem is a class that represents a menu item in a restaurant.
 * It contains information about the item ID, name, description, price, restaurant ID, category, image URL,
 * whether it is vegetarian or not, and whether it is available or not.
 */
@Data
@Document(collection = "menu") // MongoDB collection name
public class MenuItem {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String restaurantId;
    private String category;
    private String imageUrl;
    private boolean isVegetarian;
    private boolean isAvailable;
}
