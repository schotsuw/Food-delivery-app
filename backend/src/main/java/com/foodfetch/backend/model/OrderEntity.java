package com.foodfetch.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "orders")
public class OrderEntity {
    @Id
    private String id;
    private String restaurantId;
    private double amount;
    private List<String> items;

    public OrderEntity(String restaurantId, double amount, List<String> items) {
        this.restaurantId = restaurantId;
        this.amount = amount;
        this.items = items;
    }
}
