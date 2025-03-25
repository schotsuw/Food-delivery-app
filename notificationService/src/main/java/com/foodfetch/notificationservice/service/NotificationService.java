package com.foodfetch.notificationservice.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodfetch.notificationservice.factories.*;
import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.observer.EventListener;
import com.foodfetch.notificationservice.observer.EventManager;

// Notification Service
@Service
public class NotificationService implements EventListener {

  private Map<String, NotificationFactory> factoryMap = new HashMap<>();

  @Autowired
  public NotificationService(EventManager eventManager) {
    eventManager.addListener(this);

    factoryMap.put("order-confirmed", new OrderConfirmationFactory());
    factoryMap.put("order-preparation", new OrderPreparationFactory());
    factoryMap.put("delivery-update", new DeliveryUpdateFactory());
    factoryMap.put("order-arrival", new OrderArrivalFactory());
  }

  // Update
  // TODO: Modify to Handle Notifications Differently
  @Override
  public void update(String eventType) {
    NotificationFactory factory = factoryMap.get(eventType);

    // Unexpected Event Type
    if (factory == null) {
      System.out.println("NotificationService: No factory found for event type: " + eventType);
      return;
    }

    // Notification
    Notification notification = factory.createNotification();
    String message = notification.send();

    // Send Notification
    System.out.println(message);

  }

}
