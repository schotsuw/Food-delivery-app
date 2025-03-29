package com.foodfetch.orderService.messaging;

import com.foodfetch.orderService.Service.OrderService;
import com.foodfetch.orderService.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * PaymentEventConsumer is responsible for consuming payment events from the payment queue.
 * It listens for payment success and failure events and updates order status accordingly.
 */
@Component
public class PaymentEventConsumer {

    private static final Logger logger = LoggerFactory.getLogger(PaymentEventConsumer.class);
    private final OrderService orderService;

    public PaymentEventConsumer(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Consumes payment events from the payment queue and processes them.
     *
     * @param paymentEvent The payment event received from RabbitMQ, deserialized as a Map
     */
    @RabbitListener(queues = "${rabbitmq.queue.payment.name}")
    public void consumePaymentEvent(Map<String, Object> paymentEvent) {
        logger.info("Received payment event: {}", paymentEvent);

        try {
            // Extract key information from the payment event
            String eventType = (String) paymentEvent.get("eventType");
            String orderId = (String) paymentEvent.get("orderId");

            if (orderId == null || orderId.trim().isEmpty()) {
                logger.error("Payment event missing orderId: {}", paymentEvent);
                return;
            }

            logger.info("Processing payment event of type {} for order {}", eventType, orderId);

            // Handle different payment event types
            if ("PAYMENT_PROCESSED".equals(eventType)) {
                // Payment was successful, update order to CONFIRMED
                logger.info("Payment successful for order {}, updating status to CONFIRMED", orderId);
                orderService.updateOrderStatus(orderId, OrderStatus.CONFIRMED);

            } else if ("PAYMENT_FAILED".equals(eventType)) {
                // Payment failed, mark the order appropriately
                // You might want to handle this differently based on your business requirements
                logger.warn("Payment failed for order {}", orderId);
                // Option: Update to a failed status or leave as CREATED for retry
                // orderService.updateOrderStatus(orderId, OrderStatus.PAYMENT_FAILED);

            } else if ("PAYMENT_REFUNDED".equals(eventType)) {
                // Handle refund if needed
                logger.info("Payment refunded for order {}", orderId);
                // Potentially update order status or add a note about the refund
            }

        } catch (Exception e) {
            logger.error("Error processing payment event: {}", e.getMessage(), e);
        }
    }
}