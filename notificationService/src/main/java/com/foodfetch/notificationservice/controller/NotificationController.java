package com.foodfetch.notificationservice.controller;
import com.foodfetch.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.foodfetch.notificationservice.model.NotificationRequest;
import com.foodfetch.notificationservice.observer.EventManager;
import com.foodfetch.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final EventManager eventManager;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Autowired
    public NotificationController(
            EventManager eventManager,
            NotificationService notificationService, EmailService emailService) {
        this.eventManager = eventManager;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    /**
     * Simple endpoint to trigger a notification event
     */
    @PostMapping("/{eventType}")
    public ResponseEntity<String> triggerNotification(@PathVariable String eventType) {
        eventManager.notifyListener(eventType);
        return ResponseEntity.ok("Notification Triggered for Event " + eventType);
    }

    /**
     * Endpoint for sending a targeted notification to a specific customer
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        String message = notificationService.processNotification(request);
        return ResponseEntity.ok("Notification sent: " + message);
    }

    // In NotificationController.java
    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String to) {
        emailService.sendEmail(
                to,
                "Test Email from FoodFetch",
                "This is a test email from your FoodFetch application."
        );
        return ResponseEntity.ok("Test email sent!");
    }
}