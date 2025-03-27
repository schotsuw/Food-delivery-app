package com.foodfetch.trackingservice.model;

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
}
