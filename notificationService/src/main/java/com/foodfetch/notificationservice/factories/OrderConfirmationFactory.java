package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

/**
 * OrderConfirmationFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderConfirmationNotification.
 */
public class OrderConfirmationFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderConfirmationNotification();
  }
}
