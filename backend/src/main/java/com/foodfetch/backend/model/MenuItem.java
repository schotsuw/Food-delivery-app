// MenuItem.java
package com.foodfetch.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "menu")
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
