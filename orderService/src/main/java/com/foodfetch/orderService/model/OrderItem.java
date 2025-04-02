package com.foodfetch.orderService.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OrderItem represents an item in an order.
 * It contains the necessary information about the item.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String itemId;
    private String name;
    private int quantity;
    private double price;
    private String specialInstructions;
}
