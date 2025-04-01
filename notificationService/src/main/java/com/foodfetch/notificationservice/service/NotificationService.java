package com.foodfetch.notificationservice.service;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodfetch.notificationservice.factories.*;
import com.foodfetch.notificationservice.model.NotificationRequest;
import com.foodfetch.notificationservice.model.OrderEvent;
import com.foodfetch.notificationservice.notifications.Notification;
import com.foodfetch.notificationservice.observer.EventListener;
import com.foodfetch.notificationservice.observer.EventManager;

/**
 * NotificationService is responsible for handling notifications related to order events.
 * It listens for events from the EventManager and processes them accordingly.
 * It uses factories to create different types of notifications based on the event type.
 * It also manages the sending of emails through the EmailService.
 */
@Service
public class NotificationService implements EventListener {

  private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

  // Map to hold factories for different notification types
  private Map<String, NotificationFactory> factoryMap = new HashMap<>();

  // EmailService instance to send emails
  private final EmailService emailService;

  // Thread-local storage for the current OrderEvent being processed
  private ThreadLocal<OrderEvent> currentEvent = new ThreadLocal<>();

  /**
   * Constructor for NotificationService
   *
   * @param eventManager The event manager to listen for events
   * @param emailService The email service to send emails
   **/
  @Autowired
  public NotificationService(
          EventManager eventManager,
          EmailService emailService) {

    eventManager.addListener(this);
    this.emailService = emailService;


    // Register factories
    factoryMap.put("order-created", new OrderStatusUpdateFactory());
    factoryMap.put("order-confirmed", new OrderConfirmationFactory());
    factoryMap.put("order-preparation", new OrderPreparationFactory());
    factoryMap.put("order-in-transit", new OrderInTransitFactory());
    factoryMap.put("delivery-update", new DeliveryUpdateFactory());
    factoryMap.put("order-arrival", new OrderArrivalFactory());
    factoryMap.put("order-status-update", new OrderStatusUpdateFactory()); // Default case
    factoryMap.put("order-cancelled", new OrderCancelledFactory());
  }

  /**
   * Handles the event update and processes the notification
   *
   * @param eventType The type of event that occurred
   */
  @Override
  public void update(String eventType) {
    logger.info("Received event: {}", eventType);

    // Create a simple request with your email for testing
    NotificationRequest request = new NotificationRequest();
    request.setEventType(eventType);
    request.setCustomerEmail("saran.chotsuwan000@gmail.com");  // Your email for testing

    // Get the orderId from the current event if available
    OrderEvent event = currentEvent.get();
    if (event != null) {
      request.setOrderId(event.getOrderId());
      request.setCustomerId(event.getCustomerId());
      logger.info("Processing notification for order: {}", event.getOrderId());
    }

    handleNotification(eventType, request);
  }

  /**
   * Processes a notification request and triggers the appropriate notification
   *
   * @param request The notification request containing customer data
   * @return The message sent in the notification
   */
  public String processNotification(NotificationRequest request) {
    return handleNotification(request.getEventType(), request);
  }

  /**
   * Processes an order event and triggers the appropriate notification
   *
   * @param event The order event to process
   */
  public void processOrderEvent(OrderEvent event) {
    logger.info("Processing order event: {}", event.getEventType());
    try {
      // Store the event for use in the update method
      currentEvent.set(event);

      // Map the order status to a notification event type
      String notificationType = mapToNotificationType(event);

      // Trigger the notification
      update(notificationType);
    } finally {
      // Clear the thread local to prevent memory leaks
      currentEvent.remove();
    }
  }

  /**
   * Maps the order event to a notification type
   *
   * @param event The order event to map
   * @return The mapped notification type
   */
  private String mapToNotificationType(OrderEvent event) {

    // Check if the event type is already mapped
    if (event.getEventType() != null) {
      switch (event.getEventType()) {
        case OrderEvent.ORDER_CREATED:
          return "order-created";
        case OrderEvent.ORDER_CONFIRMED:
          return "order-confirmed";
        case OrderEvent.ORDER_COMPLETED, OrderEvent.ORDER_ARRIVAL:
          return "order-arrival";
        case OrderEvent.ORDER_CANCELLED:
          return "order-cancelled";
        case OrderEvent.ORDER_IN_TRANSIT:
          return "order-in-transit";
        default:
          break;
      }
    }

    // Map the order status to a notification type
    if (event.getOrderStatus() != null) {
      switch (event.getOrderStatus()) {
        case CREATED:
          return "order-created";
        case CONFIRMED:
          return "order-confirmed";
        case PREPARING:
          return "order-preparation";
        case IN_TRANSIT:
          return "delivery-update";
        case DELIVERED:
          return "order-arrival";
        case CANCELLED:
          return "order-cancelled";
        default:
          return "order-status-update";
      }
    }

    // Default if no useful information is available
    return "order-status-update";
  }

  /**
   * Handles the notification based on the event type and request
   *
   * @param eventType The type of event that occurred
   * @param request The notification request containing customer data
   * @return The message sent in the notification
   */
  private String handleNotification(String eventType, NotificationRequest request) {
    NotificationFactory factory = factoryMap.get(eventType);

    // Handle unexpected event type
    if (factory == null) {
      String errorMsg = "NotificationService: No factory found for event type: " + eventType;
      logger.error(errorMsg);
      return errorMsg;
    }

    // Create notification
    Notification notification = factory.createNotification();
    String message = notification.send(request.getOrderId());

    // Send through appropriate channels if customer data exists
    if (request != null && request.getCustomerId() != null) {
      // Send email if email is available
      if (request.getCustomerEmail() != null) {
        emailService.sendEmail(
                request.getCustomerEmail(),
                "FoodFetch: " + eventType,
                message,
                request.getOrderId());
      }


    }
    else {
      // For testing: always email your email address when no specific customer is targeted
      assert request != null;
      emailService.sendEmail(
              "saran.chotsuwan000@gmail.com",  // default email for testing
              "FoodFetch: " + eventType,
              message,
              request.getOrderId());

      // Log the notification
      logger.info("Notification: {}", message);
    }

    return message;
  }
}