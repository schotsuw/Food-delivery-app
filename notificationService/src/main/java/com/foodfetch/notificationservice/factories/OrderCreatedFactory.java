package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.notifications.OrderConfirmationNotification;
import com.foodfetch.notificationservice.notifications.OrderCreatedNotification;

/**
 * OrderCreatedFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderCreatedNotification.
 */
public class OrderCreatedFactory implements NotificationFactory {
    @Override
    public Notification createNotification() {
        return new OrderCreatedNotification();
    }
}