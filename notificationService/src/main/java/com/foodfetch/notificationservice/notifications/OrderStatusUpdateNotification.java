package com.foodfetch.notificationservice.notifications;

public class OrderStatusUpdateNotification implements Notification {
    @Override
    public String send() {
        return "Your order status has been updated";
    }
}