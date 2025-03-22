package com.foodfetch.notificationservice.notifications;

// Order Confirmation
public class OrderConfirmationNotification implements Notification {
  @Override
  public String send() {
    return "Your Order Has Been Confirmed";
  }
}
