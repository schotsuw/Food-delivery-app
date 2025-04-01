package com.foodfetch.notificationservice.notifications;

/**
 * OrderCanCelledNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order has been cancelled.
 */
public class OrderCanCelledNotification implements Notification {
    @Override
    public String send(String orderId) {
        return "Your order (" + orderId + ") has been cancelled";
    }
}
