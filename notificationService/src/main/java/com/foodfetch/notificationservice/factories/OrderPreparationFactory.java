package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

// Order Preparation Factory
public class OrderPreparationFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderPreparationNotification();
  }
}
