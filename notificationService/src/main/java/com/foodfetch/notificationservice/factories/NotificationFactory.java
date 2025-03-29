package com.foodfetch.notificationservice.factories;

import com.foodfetch.notificationservice.notifications.Notification;

/**
 * NotificationFactory is an interface for creating different types of notifications.
 * Implementing classes should provide the logic to create specific notification types.
 */
public interface NotificationFactory {
  Notification createNotification();
}
