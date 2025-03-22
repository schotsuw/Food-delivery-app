package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

// Order Arrival Factory
public class OrderArrivalFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderArrivalNotification();
  }
}