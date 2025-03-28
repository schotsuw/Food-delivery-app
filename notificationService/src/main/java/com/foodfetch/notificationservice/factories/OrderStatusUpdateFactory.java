package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.*;

public class OrderStatusUpdateFactory implements NotificationFactory {
    @Override
    public Notification createNotification() {
        return new OrderStatusUpdateNotification();
    }
}