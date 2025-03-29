package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

/**
 * DeliveryUpdateFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of DeliveryUpdateNotification.
 */
public class DeliveryUpdateFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new DeliveryUpdateNotification();
  }
}
