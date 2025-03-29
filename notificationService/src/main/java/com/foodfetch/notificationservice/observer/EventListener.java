package com.foodfetch.notificationservice.observer;

/**
 * EventListener is an interface for classes that want to be notified of events.
 * Implementing classes should provide the logic to handle specific events.
 */
public interface EventListener {
  void update(String eventType);
}
