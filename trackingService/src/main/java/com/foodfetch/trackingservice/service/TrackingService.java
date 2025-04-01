package com.foodfetch.trackingservice.service;

import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.foodfetch.trackingservice.messaging.DeliveryEvent;
import com.foodfetch.trackingservice.messaging.DeliveryEventSender;
import com.foodfetch.trackingservice.model.Delivery;
import com.foodfetch.trackingservice.state.DeliveryState;
import com.foodfetch.trackingservice.state.DeliveryStateFactory;
import com.foodfetch.trackingservice.state.ArrivalState;

/**
 * TrackingService is responsible for managing the tracking of deliveries.
 * It handles the state transitions, updates, and notifications related to delivery tracking.
 */
@Service
public class TrackingService {
  private static final Logger logger = LoggerFactory.getLogger(TrackingService.class);

  // Maps to store tracking information and states
  private final Map<String, Delivery> trackingMap = new ConcurrentHashMap<>();

  // Map to store the state of each delivery
  private final Map<String, DeliveryState> stateMap = new ConcurrentHashMap<>();

  // DeliveryEventSender to send delivery events
  private final DeliveryEventSender deliveryEventSender;

  /**
   * Constructor for TrackingService
   */
  public TrackingService(DeliveryEventSender deliveryEventSender) {
    this.deliveryEventSender = deliveryEventSender;
  }

  /**
   * Track a new delivery order
   *
   * @param delivery The delivery object containing order details
   */
  public void track(Delivery delivery) {
    logger.info("Starting tracking for order: {}", delivery.getOrderId());

    // Validate data
    if (delivery.getOrderId() == null || delivery.getOrderId().isEmpty()) {
      logger.error("Invalid order ID: {}", delivery.getOrderId());
      return;
    }

    // Initialize state as PREPARING
    if (delivery.getStatus() == null || delivery.getStatus().isEmpty()) {
      delivery.setStatus("PREPARING");
    }

    // Get the appropriate state and update the delivery
    DeliveryState initialState = DeliveryStateFactory.getState(delivery.getStatus());
    initialState.updateStatus(delivery);

    // Store the delivery and its state
    trackingMap.put(delivery.getOrderId(), delivery);
    stateMap.put(delivery.getOrderId(), initialState);

    logger.info("Order {} is now being tracked with status: {}",
            delivery.getOrderId(), delivery.getStatus());
  }

  /**
   * Get tracking information for a specific order
   *
   * @param orderId The order ID to retrieve tracking information for
   * @return The Delivery object containing tracking information
   */
  public Delivery getTrackingInfo(String orderId) {
    logger.info("Getting tracking info for order: {}", orderId);
    return trackingMap.get(orderId);
  }

  /**
   * Manually progress the delivery state
   */
  public void progressDelivery(String orderId) {
    logger.info("Manually progressing delivery for order: {}", orderId);

    Delivery delivery = trackingMap.get(orderId);
    DeliveryState currentState = stateMap.get(orderId);

    if (delivery == null || currentState == null) {
      logger.warn("No tracking information found for order: {}", orderId);
      return;
    }

    // Move to the next state
    DeliveryState nextState = currentState.next();
    nextState.updateStatus(delivery);
    stateMap.put(orderId, nextState);

    logger.info("Order {} progressed to state: {}", orderId, nextState.getStateName());

    // Publish status update for all state changes
    publishStatusUpdate(delivery);

    // Check if delivered
    if (nextState instanceof ArrivalState) {
      handleDeliveryCompletion(delivery);
    }
  }

  /**
   * Handle delivery completion
   * @param delivery
   */
  private void handleDeliveryCompletion(Delivery delivery) {
    logger.info("Order {} has been delivered", delivery.getOrderId());

    // Send delivery completion event
    DeliveryEvent deliveryEvent = new DeliveryEvent(delivery.getOrderId(), "DELIVERED");
    deliveryEventSender.sendDeliveryEvent(deliveryEvent);

    // Remove from tracking
    trackingMap.remove(delivery.getOrderId());
    stateMap.remove(delivery.getOrderId());
  }

  /**
   * Scheduled task to update all deliveries
   */
  @Scheduled(fixedRate = 15000) // Every 15 seconds
  public void updateAllDeliveries() {
    logger.info("Running scheduled update for all deliveries. Current tracked orders: {}", trackingMap.size());

    // Get a copy of the keys to avoid concurrent modification
    List<String> orderIds = new ArrayList<>(trackingMap.keySet());

    for (String orderId : orderIds) {
      updateDeliveryState(orderId);
    }

    // Add this line to call the stale deliveries check
    checkForStaleDeliveries();
  }

  /**
   * Update the delivery state based on the current status
   *
   * @param orderId The order ID to update
   */
  private void updateDeliveryState(String orderId) {
    Delivery delivery = trackingMap.get(orderId);
    DeliveryState currentState = stateMap.get(orderId);

    if (delivery == null || currentState == null) {
      return;
    }

    // Extract ETA
    String etaString = delivery.getEta();
    int minutes = Integer.parseInt(etaString.split(" ")[0]);

    // Progress state based on ETA
    if (minutes <= 0 && !(currentState instanceof ArrivalState)) {
      // Time to deliver
      DeliveryState deliveredState = new ArrivalState();
      deliveredState.updateStatus(delivery);
      stateMap.put(orderId, deliveredState);
      handleDeliveryCompletion(delivery);
    } else if (minutes <= 5 && currentState.getStateName().equals("PREPARING")) {
      // Progress from PREPARING to IN_TRANSIT when ETA is 5 minutes or less
      progressDelivery(orderId);
    } else {
      // Just update the current state (might reduce ETA)
      currentState.updateStatus(delivery);
    }
  }

  /*
   * Manually update the tracking information for a specific order
   *
   * @param orderId The order ID to update
   */
  public void updateTracking(String orderId) {
    logger.info("Manual update requested for order: {}", orderId);
    updateDeliveryState(orderId);
  }

  /**
   * Get tracking information for a specific order
   * @param orderId
   * @return
   */
  public Delivery getTrackingInfo(Long orderId) {
    return getTrackingInfo(String.valueOf(orderId));
  }

  /**
   * Manually update the tracking information for a specific order
   * @param orderId
   */
  public void updateTracking(Long orderId) {
    updateTracking(String.valueOf(orderId));
  }

  private void checkForStaleDeliveries() {
    long currentTime = System.currentTimeMillis();
    logger.info("Checking for stale deliveries");

    for (String orderId : new ArrayList<>(trackingMap.keySet())) {
      Delivery delivery = trackingMap.get(orderId);
      if (delivery == null) continue;

      long lastUpdate = delivery.getStatusLastUpdated().toInstant(ZoneOffset.UTC).toEpochMilli();
      long timeSinceLastUpdate = currentTime - lastUpdate;

      logger.debug("Order {}: Status = {}, Time since last update = {} ms",
              orderId, delivery.getStatus(), timeSinceLastUpdate);

      // If more than 30 seconds since last update and not delivered
      if (timeSinceLastUpdate > 30000 &&
              !delivery.getStatus().equals("DELIVERED")) {
        logger.info("Progressing stale delivery: {} from status: {}",
                orderId, delivery.getStatus());
        progressDelivery(orderId);
      }
    }
  }

  private void publishStatusUpdate(Delivery delivery) {
    logger.info("Publishing status update for order {}: {}",
            delivery.getOrderId(), delivery.getStatus());
    DeliveryEvent deliveryEvent = new DeliveryEvent(
            delivery.getOrderId(),
            delivery.getStatus()
    );
    deliveryEventSender.sendDeliveryEvent(deliveryEvent);
  }


}