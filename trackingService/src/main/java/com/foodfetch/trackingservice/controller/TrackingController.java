package com.foodfetch.trackingservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodfetch.trackingservice.model.Delivery;
import com.foodfetch.trackingservice.service.TrackingService;

@RestController
@RequestMapping("/tracking")
public class TrackingController {
  private final TrackingService trackingService;

  public TrackingController(TrackingService trackingService) {
    this.trackingService = trackingService;
  }

  @PostMapping("/start")
  public void startTracking(@RequestBody Delivery delivery) {
    trackingService.track(delivery);
  }

  @GetMapping("/{orderId}")
  public ResponseEntity<Delivery> getTrackingInfo(@PathVariable Long orderId) {
    Delivery delivery = trackingService.getTrackingInfo(orderId);
    if (delivery == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(delivery);
  }

  @PutMapping("/{orderId}/update")
  public ResponseEntity<String> updateTracking(@PathVariable Long orderId) {
    trackingService.updateTracking(orderId);
    return ResponseEntity.ok("Tracking updated for order: " + orderId);
  }

}
