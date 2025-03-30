package com.foodfetch.trackingservice.service;

import java.util.*;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.foodfetch.trackingservice.messaging.DeliveryEvent;
import com.foodfetch.trackingservice.messaging.DeliveryEventSender;
import com.foodfetch.trackingservice.model.Delivery;

@Service
public class TrackingService {

  private final Map<Long, Delivery> trackingMap = new HashMap<>();
  private final DeliveryEventSender deliveryEventSender;

  // Constructor
  public TrackingService(DeliveryEventSender deliveryEventSender) {
    this.deliveryEventSender = deliveryEventSender;
  }

  // Track Order
  public void track(Delivery delivery) {
    Long orderId;
    try {
      orderId = Long.parseLong(delivery.getOrderId());
    } catch (NumberFormatException e) {
      System.err.println("Invalid Order ID: " + delivery.getOrderId());
      return;
    }

    String eta = estimateETA(
        delivery.getRestaurantLatitude(),
        delivery.getRestaurantLongitude(),
        delivery.getCustomerLatitude(),
        delivery.getCustomerLongitude());

    delivery.setEta(eta);
    trackingMap.put(orderId, delivery);
  }

  // Get Delivery
  public Delivery getTrackingInfo(Long orderId) {
    return trackingMap.get(orderId);
  }

  // Complete Tracking
  public void updateTracking(Long orderId) {
    Delivery delivery = trackingMap.get(orderId);
    if (delivery == null) {
      return;
    }

    String etaStr = estimateETA(
        delivery.getRestaurantLatitude(),
        delivery.getRestaurantLongitude(),
        delivery.getCustomerLatitude(),
        delivery.getCustomerLongitude());

    int eta = Integer.parseInt(etaStr.split(" ")[0]);

    if (eta <= 0) {
      delivery.setStatus("DELIVERED");
      delivery.setEta("0 min");
      trackingMap.remove(orderId);

      DeliveryEvent deliveryEvent = new DeliveryEvent(delivery.getOrderId(), delivery.getStatus());
      deliveryEventSender.sendDeliveryEvent(deliveryEvent);
    } else {
      delivery.setEta(eta + " min");
    }

  }

  // Update Tracking
  @Scheduled(fixedRate = 60000)
  public void updateDeliveries() {
    for (Map.Entry<Long, Delivery> entry : trackingMap.entrySet()) {
      Long orderId = entry.getKey();
      updateTracking(orderId);
    }
  }

  // Estimate Delivery Time
  public String estimateETA(double srcLat, double srcLong, double destLat, double destLong) {
    final int AVERAGE_SPEED = 50;
    final double EARTH_RADIUS = 6371;

    // data
    double latDiff = Math.toRadians(destLat - srcLat);
    double lonDiff = Math.toRadians(destLong - srcLong);
    double srcLatRad = Math.toRadians(srcLat);
    double destLatRad = Math.toRadians(destLat);

    // haversine formula
    double a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(srcLatRad) * Math.cos(destLatRad) *
            Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    double distance = EARTH_RADIUS * c;
    double hours = distance / AVERAGE_SPEED;
    int eta = (int) (Math.ceil(hours * 60));

    return eta + " min";
  }

}
