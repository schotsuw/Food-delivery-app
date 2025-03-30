package com.foodfetch.orderService.messaging;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {
  private String orderId;
  private String status;
}
