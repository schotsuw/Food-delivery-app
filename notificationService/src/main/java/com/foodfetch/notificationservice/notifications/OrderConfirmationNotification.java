package com.foodfetch.notificationservice.notifications;

/**
 * OrderConfirmationNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order has been confirmed.
 */
public class OrderConfirmationNotification implements Notification {
  @Override
  public String send(String orderId) {
    return "Your order (" + orderId + ") has been confirmed";
  }
}
