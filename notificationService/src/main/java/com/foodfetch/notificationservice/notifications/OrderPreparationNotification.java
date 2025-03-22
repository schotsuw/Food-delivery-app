package com.foodfetch.notificationservice.notifications;

// Order Preparation
public class OrderPreparationNotification implements Notification {
  @Override
  public String send() {
    return "Your Order is Being Prepared";
  }
}
