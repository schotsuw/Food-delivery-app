package com.foodfetch.trackingservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.foodfetch.trackingservice.model.Delivery;
import com.foodfetch.trackingservice.service.TrackingService;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {
  private final TrackingService trackingService;

  public TrackingController(TrackingService trackingService) {
    this.trackingService = trackingService;
  }

  @PostMapping("/start")
  public ResponseEntity<String> startTracking(@RequestBody Delivery delivery) {
    if (delivery.getOrderId() == null || delivery.getOrderId().isEmpty()) {
      return ResponseEntity.badRequest().body("Order ID is required");
    }

    trackingService.track(delivery);
    return ResponseEntity.ok("Tracking started for order: " + delivery.getOrderId());
  }

  @GetMapping("/{orderId}")
  public ResponseEntity<Delivery> getTrackingInfo(@PathVariable String orderId) {
    Delivery delivery = trackingService.getTrackingInfo(orderId);
    if (delivery == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(delivery);
  }

  @PutMapping("/{orderId}/update")
  public ResponseEntity<String> updateTracking(@PathVariable String orderId) {
    trackingService.updateTracking(orderId);
    return ResponseEntity.ok("Tracking updated for order: " + orderId);
  }

  @PutMapping("/{orderId}/progress")
  public ResponseEntity<String> progressDelivery(@PathVariable String orderId) {
    Delivery delivery = trackingService.getTrackingInfo(orderId);
    if (delivery == null) {
      return ResponseEntity.notFound().build();
    }

    trackingService.progressDelivery(orderId);
    return ResponseEntity.ok("Order " + orderId + " progressed to next state: " +
            trackingService.getTrackingInfo(orderId).getStatus());
  }

  @PutMapping("/{orderId}/complete")
  public ResponseEntity<String> completeDelivery(@PathVariable String orderId) {
    Delivery delivery = trackingService.getTrackingInfo(orderId);
    if (delivery == null) {
      return ResponseEntity.notFound().build();
    }

    // Force completion by progressing until delivered
    while (!"DELIVERED".equals(trackingService.getTrackingInfo(orderId).getStatus())) {
      trackingService.progressDelivery(orderId);

      // Safety check - if order is no longer tracked, it's completed
      if (trackingService.getTrackingInfo(orderId) == null) {
        break;
      }
    }

    return ResponseEntity.ok("Delivery completed for order: " + orderId);
  }
}