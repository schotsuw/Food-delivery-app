package com.foodfetch.notificationservice.notifications;

/**
 * OrderArrivalNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order has arrived.
 */
public class OrderArrivalNotification implements Notification {
  @Override
  public String send() {
    return "Your Order Has Arrived";
  }
}
