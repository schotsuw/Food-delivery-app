package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.notifications.OrderCanCelledNotification;

/**
 * OrderCancelledFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderCancelledNotification.
 */
public class OrderCancelledFactory implements NotificationFactory {
    @Override
    public Notification createNotification() {
        return new OrderCanCelledNotification();
    }
}
