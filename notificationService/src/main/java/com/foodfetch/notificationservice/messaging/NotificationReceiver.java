package com.foodfetch.notificationservice.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodfetch.notificationservice.model.OrderEvent;
import com.foodfetch.notificationservice.observer.EventManager;
import com.foodfetch.notificationservice.service.NotificationService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * NotificationReceiver is responsible for receiving messages from RabbitMQ and processing them.
 * It handles various message types and notifies the appropriate listeners.
 */
@Component
public class NotificationReceiver {

    private static final Logger logger = LoggerFactory.getLogger(NotificationReceiver.class);
    private final ObjectMapper objectMapper;
    private final EventManager eventManager;
    private final NotificationService notificationService;

    @Autowired
    public NotificationReceiver(EventManager eventManager, NotificationService notificationService) {
        this.eventManager = eventManager;
        this.notificationService = notificationService;
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
            OrderEvent orderEvent = null;

            // Handle different message types
            if (message instanceof OrderEvent) {
                // Direct OrderEvent handling
                orderEvent = (OrderEvent) message;
                eventType = orderEvent.getEventType();
                logger.info("Received OrderEvent: {}", orderEvent);
            } else if (message instanceof byte[]) {
                // Convert byte array to string
                String messageStr = new String((byte[]) message);
                JsonNode messageJson = objectMapper.readTree(messageStr);
                eventType = messageJson.get("eventType").asText();
                orderEvent = tryConvertToOrderEvent(messageJson);
            } else if (message instanceof String) {
                // Direct string handling
                JsonNode messageJson = objectMapper.readTree((String) message);
                eventType = messageJson.get("eventType").asText();
                orderEvent = tryConvertToOrderEvent(messageJson);
            } else {
                // Try to convert the object directly
                JsonNode messageJson = objectMapper.valueToTree(message);
                eventType = messageJson.get("eventType").asText();
                orderEvent = tryConvertToOrderEvent(messageJson);
            }

            // If we have a valid OrderEvent, process it with the OrderEvent
            if (orderEvent != null) {
                logger.info("Processing order event: {}", orderEvent);
                notificationService.processOrderEvent(orderEvent);
            }
            // Otherwise, notify with just the event type
            else if (eventType != null) {
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

    /**
     * Attempts to convert a JsonNode to an OrderEvent
     *
     * @param jsonNode The JSON node to convert
     * @return An OrderEvent if conversion was successful, otherwise null
     */
    private OrderEvent tryConvertToOrderEvent(JsonNode jsonNode) {
        try {
            return objectMapper.treeToValue(jsonNode, OrderEvent.class);
        } catch (Exception e) {
            logger.warn("Could not convert message to OrderEvent: {}", e.getMessage());
            return null;
        }
    }
}