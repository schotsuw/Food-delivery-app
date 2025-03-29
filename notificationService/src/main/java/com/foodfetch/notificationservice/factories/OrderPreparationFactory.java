package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

/**
 * OrderPreparationFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderPreparationNotification.
 */
public class OrderPreparationFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderPreparationNotification();
  }
}
