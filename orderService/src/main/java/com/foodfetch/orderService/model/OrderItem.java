package com.foodfetch.orderService.model;

import lombok.Data;

/**
 * OrderItem represents an item in an order.
 * It contains the necessary information about the item.
 */
@Data
public class OrderItem {
    private String itemId;
    private String name;
    private int quantity;
    private double price;
    private String specialInstructions;
}
