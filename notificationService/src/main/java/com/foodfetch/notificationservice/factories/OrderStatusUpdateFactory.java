package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

/**
 * OrderStatusUpdateFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderStatusUpdateNotification.
 */
public class OrderStatusUpdateFactory implements NotificationFactory {
    @Override
    public Notification createNotification() {
        return new OrderStatusUpdateNotification();
    }
}