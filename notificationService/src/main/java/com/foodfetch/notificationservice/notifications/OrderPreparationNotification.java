package com.foodfetch.notificationservice.notifications;

/**
 * OrderPreparationNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order is being prepared.
 */
public class OrderPreparationNotification implements Notification {
  @Override
  public String send(String orderId) {
    return "Your order (" + orderId + ") is being prepared";
  }
}
