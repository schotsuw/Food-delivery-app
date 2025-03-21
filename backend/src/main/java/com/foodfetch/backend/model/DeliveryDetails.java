package com.foodfetch.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryDetails {
    private String deliveryId;
    private String driverId;
    private String deliveryAddress;
    private Location currentLocation;
    private LocalDateTime estimatedDeliveryTime;
}