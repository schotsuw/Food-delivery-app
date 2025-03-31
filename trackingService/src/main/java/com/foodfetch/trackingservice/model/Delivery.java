package com.foodfetch.trackingservice.model;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Delivery {
  private String orderId;
  private String status;
  private double restaurantLatitude;
  private double restaurantLongitude;
  private double customerLatitude;
  private double customerLongitude;
  private String eta;

  // Enhanced fields
  private String restaurantName;
  private String customerName;
  private LocalDateTime orderTime;
  private LocalDateTime estimatedDeliveryTime;
  private String driverId;
  private String driverName;
  private String driverPhone;
  private String notes;

  // Current location (for simulating real-time tracking)
  private double currentLatitude;
  private double currentLongitude;

  // For statistics
  private LocalDateTime statusLastUpdated;

  // Constructor
  public Delivery() {
    this.statusLastUpdated = LocalDateTime.now();
  }

  // Update the status last updated timestamp
  public void updateStatusTimestamp() {
    this.statusLastUpdated = LocalDateTime.now();
  }
}