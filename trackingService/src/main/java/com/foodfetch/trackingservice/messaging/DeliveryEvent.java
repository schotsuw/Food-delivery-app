package com.foodfetch.trackingservice.messaging;

import java.io.Serializable;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEvent implements Serializable {
  private String orderId;
  private String status;
}
