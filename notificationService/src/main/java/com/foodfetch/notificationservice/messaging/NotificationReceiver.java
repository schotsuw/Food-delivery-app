package com.foodfetch.notificationservice.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodfetch.notificationservice.model.OrderEvent;
import com.foodfetch.notificationservice.observer.EventManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class NotificationReceiver {

    private static final Logger logger = LoggerFactory.getLogger(NotificationReceiver.class);
    private final ObjectMapper objectMapper;
    private final EventManager eventManager;

    @Autowired
    public NotificationReceiver(EventManager eventManager) {
        this.eventManager = eventManager;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Receives messages from RabbitMQ and processes them
     * The method is now prepared to handle various input types
     */
    public void receiveMessage(Object message) {
        try {
            logger.info("Received message: {}", message);

            String eventType = null;

            // Handle different message types
            if (message instanceof OrderEvent) {
                // Direct OrderEvent handling
                OrderEvent orderEvent = (OrderEvent) message;
                eventType = orderEvent.getEventType();
                logger.info("Received OrderEvent: {}", orderEvent);
            } else if (message instanceof byte[]) {
                // Convert byte array to string
                String messageStr = new String((byte[]) message);
                JsonNode messageJson = objectMapper.readTree(messageStr);
                eventType = messageJson.get("eventType").asText();
            } else if (message instanceof String) {
                // Direct string handling
                JsonNode messageJson = objectMapper.readTree((String) message);
                eventType = messageJson.get("eventType").asText();
            } else {
                // Try to convert the object directly
                JsonNode messageJson = objectMapper.valueToTree(message);
                eventType = messageJson.get("eventType").asText();
            }

            // Notify the appropriate listeners
            if (eventType != null) {
                logger.info("Processing notification for event type: {}", eventType);
                eventManager.notifyListener(eventType);
                logger.info("Successfully processed notification for event: {}", eventType);
            } else {
                logger.error("Could not determine event type from message");
            }
        } catch (Exception e) {
            logger.error("Error processing notification message: {}", e.getMessage(), e);
        }
    }
}