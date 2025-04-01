package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.notifications.OrderInTransitNotification;

/**
 * OderInTransitFactory is a concrete implementation of the NotificationFactory interface.
 * It creates instances of OrderInTransitNotification.
 */
public class OrderInTransitFactory implements NotificationFactory {
    @Override
    public Notification createNotification() {
        return new OrderInTransitNotification();
    }
}
