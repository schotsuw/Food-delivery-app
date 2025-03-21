package com.foodfetch.backend.model;

public enum OrderStatus {
    CREATED,
    CONFIRMED,
    PREPARING,
    READY_FOR_PICKUP,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}
