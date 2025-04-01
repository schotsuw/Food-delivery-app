package com.foodfetch.notificationservice.notifications;

/**
 * DeliveryUpdateNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user about the delivery status of their order.
 */
public class DeliveryUpdateNotification implements Notification {
  @Override
  public String send(String orderId) {
    return "Your order (" + orderId + ") is now on route";
  }
}
