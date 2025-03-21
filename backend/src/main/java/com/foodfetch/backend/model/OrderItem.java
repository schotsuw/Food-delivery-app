package com.foodfetch.backend.model;

import lombok.Data;

@Data
public class OrderItem {
    private String itemId;
    private String name;
    private int quantity;
    private double price;
    private String specialInstructions;
}
