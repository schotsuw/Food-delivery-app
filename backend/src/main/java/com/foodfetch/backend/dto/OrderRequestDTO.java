package com.foodfetch.backend.dto;

import java.util.List;

public class OrderRequestDTO {
    private String restaurant;
    private double amount;
    private List<String> items;

    public String getRestaurant() {
        return restaurant;
    }

    public double getAmount() {
        return amount;
    }

    public List<String> getItems() {
        return items;
    }
}
