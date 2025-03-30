package com.foodfetch.notificationservice.observer;

import java.util.List;

import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * EventManager is responsible for managing event listeners and notifying them of events.
 * It maintains a list of listeners and provides methods to add listeners and notify them of events.
 */
@Component
public class EventManager {
  // List of event listeners
  private List<EventListener> listeners = new ArrayList<>();

  // Method to add a listener to the list
  public void addListener(EventListener listener) {
    listeners.add(listener);
  }

  // Method to notify all listeners of an event
  public void notifyListener(String eventType) {
    for (EventListener listener : listeners) {
      listener.update(eventType);
    }
  }

}
