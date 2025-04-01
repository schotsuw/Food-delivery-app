package com.foodfetch.notificationservice.notifications;

/**
 * OrderStatusUpdateNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order status has been updated.
 */
public class OrderStatusUpdateNotification implements Notification {
    @Override
    public String send(String orderId) {
        return "Your order (" + orderId + ") status has been updated";
    }
}