package com.foodfetch.notificationservice.notifications;

/**
 * OrderCreatedNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order has been created.
 */
public class OrderCreatedNotification implements Notification {
    @Override
    public String send() {
        return "Your Order Has Been Created";
    }
}
