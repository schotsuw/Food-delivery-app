package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

/**
 * OrderArrivalFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderArrivalNotification.
 */
public class OrderArrivalFactory implements NotificationFactory {
  @Override
  public Notification createNotification() {
    return new OrderArrivalNotification();
  }
}