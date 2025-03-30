package com.foodfetch.trackingservice.messaging;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
  private String orderId;
  private String orderStatus;
  private String restaurantId;
  private Double totalAmount;
  private String eventType;
  private LocalDateTime timestamp;
  private Long customerId;
  private String paymentMethod;
  private double restaurantLat;
  private double restaurantLong;
  private double customerLat;
  private double customerLong;

  public static final String ORDER_CONFIRMED = "ORDER_CONFIRMED";
}
