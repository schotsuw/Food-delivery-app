package com.foodfetch.orderService.model;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DeliveryDetails is a class that represents the details of a delivery.
 * It contains information about the delivery ID, driver ID, delivery address, estimated delivery time, and delivery fee.
 */
@Data
public class DeliveryDetails {
    private String deliveryId;
    private String driverId;
    private String deliveryAddress;
    private LocalDateTime estimatedDeliveryTime;
    private double deliveryFee;
}