package com.foodfetch.notificationservice.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Represents a request to send a notification
 */
@Setter
@Getter
public class NotificationRequest {

    // Getters and setters
    private String eventType;
    private String customerId;
    private String customerEmail;
    private String customerPhone;
    private String deviceToken;
    private String orderId;
    private String additionalData;

    // Default constructor
    public NotificationRequest() {
    }

    // Constructor with essential fields
    public NotificationRequest(String eventType, String customerId) {
        this.eventType = eventType;
        this.customerId = customerId;
    }

    @Override
    public String toString() {
        return "NotificationRequest [eventType=" + eventType +
                ", customerId=" + customerId +
                ", customerEmail=" + customerEmail +
                ", orderId=" + orderId + "]";
    }
}