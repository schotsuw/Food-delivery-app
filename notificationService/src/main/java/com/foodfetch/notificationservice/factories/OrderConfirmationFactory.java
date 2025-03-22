package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

// Order Confirmation Factory
public class OrderConfirmationFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderConfirmationNotification();
  }
}
