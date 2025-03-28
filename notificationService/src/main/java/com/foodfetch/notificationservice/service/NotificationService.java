package com.foodfetch.notificationservice.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodfetch.notificationservice.factories.*;
import com.foodfetch.notificationservice.model.NotificationRequest;
import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.observer.EventListener;
import com.foodfetch.notificationservice.observer.EventManager;

@Service
public class NotificationService implements EventListener {

  private Map<String, NotificationFactory> factoryMap = new HashMap<>();
  private final EmailService emailService;
  private final PushNotificationService pushService;

  @Autowired
  public NotificationService(
          EventManager eventManager,
          EmailService emailService,
          PushNotificationService pushService) {

    eventManager.addListener(this);
    this.emailService = emailService;
    this.pushService = pushService;

    // Register factories
    factoryMap.put("order-confirmed", new OrderConfirmationFactory());
    factoryMap.put("order-preparation", new OrderPreparationFactory());
    factoryMap.put("delivery-update", new DeliveryUpdateFactory());
    factoryMap.put("order-arrival", new OrderArrivalFactory());
    factoryMap.put("order-status-update", new OrderStatusUpdateFactory());  // Add this generic factory
  }

  /**
   * Handles notification events from the event manager
   */
  @Override
  public void update(String eventType) {
    // Create a simple request with your email for testing
    NotificationRequest request = new NotificationRequest();
    request.setEventType(eventType);
    request.setCustomerEmail("saran.chotsuwan000@gmail.com");  // Your email for testing

    handleNotification(eventType, request);
  }

  /**
   * Processes a notification request with customer data
   *
   * @param request The notification request containing event type and customer data
   * @return The notification message that was sent
   */
  public String processNotification(NotificationRequest request) {
    return handleNotification(request.getEventType(), request);
  }

  /**
   * Handles notifications with or without customer data
   *
   * @param eventType The type of notification event
   * @param request Optional request with customer data
   * @return The notification message
   */
  private String handleNotification(String eventType, NotificationRequest request) {
    NotificationFactory factory = factoryMap.get(eventType);

    // Handle unexpected event type
    if (factory == null) {
      String errorMsg = "NotificationService: No factory found for event type: " + eventType;
      System.out.println(errorMsg);
      return errorMsg;
    }

    // Create notification
    Notification notification = factory.createNotification();
    String message = notification.send();

    // Send through appropriate channels if customer data exists
    if (request != null && request.getCustomerId() != null) {
      // Send email if email is available
      if (request.getCustomerEmail() != null) {
        emailService.sendEmail(request.getCustomerEmail(),
                "FoodFetch: " + eventType, message);
      }

      // Send push notification if token is available
      if (request.getDeviceToken() != null) {
        pushService.sendPushNotification(
                request.getDeviceToken(),
                "FoodFetch",
                message);
      }
    } else {
      // For testing: always send an email to your address when no specific customer is targeted
      emailService.sendEmail("saran.chotsuwan000@gmail.com",  // Replace with your email
              "FoodFetch: " + eventType,
              "This is a notification for event: " + eventType + "\n\n" + message);

      // Log the notification
      System.out.println("Notification: " + message);
    }

    return message;
  }
}