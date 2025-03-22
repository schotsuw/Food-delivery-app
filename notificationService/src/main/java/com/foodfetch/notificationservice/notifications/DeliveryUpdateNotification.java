package com.foodfetch.notificationservice.notifications;

// Delivery On Route
public class DeliveryUpdateNotification implements Notification {
  @Override
  public String send() {
    return "Your Order is Now On Route";
  }
}
