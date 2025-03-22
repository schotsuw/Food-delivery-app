package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.Notification;

// Notification Factory Interface
public interface NotificationFactory {
  Notification createNotification();
}
