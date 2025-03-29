package com.foodfetch.notificationservice.model;

import lombok.Getter;
import lombok.Setter;

/**
 * NotificationRequest is a class that represents a request for sending notifications.
 * It contains information about the event type, customer details, and additional data.
 * This class is used to create a notification request object that can be sent to the notification service.
 *
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

    /* Default constructor
     * This constructor is used to create an instance of NotificationRequest without any parameters.
     */
    public NotificationRequest() {
    }

    /* Constructor with parameters
     * @param eventType the type of event for the notification
     * @param customerId the ID of the customer
     */
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