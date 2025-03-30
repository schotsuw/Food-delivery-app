package com.foodfetch.orderService.model;

/*
 * OrderStatus.java
 * This enum represents the various statuses an order can have in the food delivery system.
 * It is used to track the progress of an order from confirmation to delivery.
 */
public enum OrderStatus {
    CREATED,
    CONFIRMED,
    PREPARING,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}
