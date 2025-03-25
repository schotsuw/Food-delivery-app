package com.foodfetch.notificationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodfetch.notificationservice.observer.EventManager;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final EventManager eventManager;

    @Autowired
    public NotificationController(EventManager eventManager) {
        this.eventManager = eventManager;
    }

    @PostMapping("/{eventType}")
    public ResponseEntity<String> triggerNotification(@PathVariable String eventType) {
        eventManager.notifyListener(eventType);
        return ResponseEntity.ok("Notification Triggered for Event " + eventType);
    }
}
