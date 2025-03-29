package com.foodfetch.notificationservice.controller;
import com.foodfetch.notificationservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.foodfetch.notificationservice.model.NotificationRequest;
import com.foodfetch.notificationservice.observer.EventManager;
import com.foodfetch.notificationservice.service.NotificationService;

/**
 * NotificationController handles HTTP requests related to notifications.
 * It provides endpoints to trigger notification events and send targeted notifications.
 */
@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    /**
     * EventManager is responsible for managing and notifying listeners of events.
     */
    private final EventManager eventManager;

    /**
     * NotificationService is responsible for processing and sending notifications.
     */
    private final NotificationService notificationService;

    /**
     * EmailService is responsible for sending emails.
     */
    private final EmailService emailService;

    /**
     * Constructor for NotificationController
     *
     * @param eventManager        EventManager to handle event notifications
     * @param notificationService NotificationService to handle notification processing
     * @param emailService        EmailService to handle email sending
     */
    @Autowired
    public NotificationController(
            EventManager eventManager,
            NotificationService notificationService, EmailService emailService) {
        this.eventManager = eventManager;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    /**
     * Endpoint for triggering a notification event
     *
     * @param eventType The type of event to trigger
     * @return ResponseEntity with a message indicating the event was triggered
     */
    @PostMapping("/{eventType}")
    public ResponseEntity<String> triggerNotification(@PathVariable String eventType) {
        eventManager.notifyListener(eventType);
        return ResponseEntity.ok("Notification Triggered for Event " + eventType);
    }

    /**
     * Endpoint for sending a notification
     *
     * @param request The notification request containing details
     * @return ResponseEntity with a message indicating the notification was sent
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        String message = notificationService.processNotification(request);
        return ResponseEntity.ok("Notification sent: " + message);
    }

    /**
     * Endpoint for testing email sending
     *
     * @param to The recipient email address
     * @return ResponseEntity with a message indicating the test email was sent
     */
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