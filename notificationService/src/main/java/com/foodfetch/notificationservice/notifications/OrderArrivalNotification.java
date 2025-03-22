package com.foodfetch.notificationservice.notifications;

// Order Arrival
public class OrderArrivalNotification implements Notification {
  @Override
  public String send() {
    return "Your Order Has Arrived";
  }
}
