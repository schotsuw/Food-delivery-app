package com.foodfetch.notificationservice.notifications;

/**
 * OrderInTransitNotification is a concrete implementation of the Notification interface.
 * It represents a notification that informs the user that their order is in transit.
 */
public class OrderInTransitNotification implements Notification {
    @Override
    public String send(String orderId) {
        return "Your Order is In Transit";
    }
}
