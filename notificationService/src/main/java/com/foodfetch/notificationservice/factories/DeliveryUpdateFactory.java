package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

// Delivery Update Factory
public class DeliveryUpdateFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new DeliveryUpdateNotification();
  }
}
