package com.foodfetch.notificationservice.observer;

import java.util.List;

import org.springframework.stereotype.Component;

import java.util.ArrayList;

// Event Manager
@Component
public class EventManager {
  private List<EventListener> listeners = new ArrayList<>();

  public void addListener(EventListener listener) {
    listeners.add(listener);
  }

  public void notifyListener(String eventType) {
    for (EventListener listener : listeners) {
      listener.update(eventType);
    }
  }

}
