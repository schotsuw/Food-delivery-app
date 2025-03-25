package com.foodfetch.orderService.Service;

import com.foodfetch.orderService.Factory.FactoryRegistry;
import com.foodfetch.orderService.Factory.OrderFactory;
import com.foodfetch.orderService.exception.OrderNotFoundException;
import com.foodfetch.orderService.exception.ResourceNotFoundException;
import com.foodfetch.orderService.messaging.RabbitMQOrderSender;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;
import com.foodfetch.orderService.model.Restaurant;
import com.foodfetch.orderService.Repository.OrderRepository;
import com.foodfetch.orderService.Repository.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final FactoryRegistry factoryRegistry;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final RabbitMQOrderSender messageSender;

    @Autowired
    public OrderService(FactoryRegistry factoryRegistry,
                        RestaurantRepository restaurantRepository,
                        OrderRepository orderRepository,
                        RabbitMQOrderSender messageSender) {
        this.factoryRegistry = factoryRegistry;
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
        this.messageSender = messageSender;
    }

    @Transactional
    public OrderEntity createOrder(String restaurantName, List<OrderItem> items) {
        // Calculate the total amount from items
        double calculatedAmount = calculateOrderTotal(items);
        logger.info("Creating order for restaurant: {}", restaurantName);
        logger.info("Calculated amount: {}", calculatedAmount);

        if (restaurantName == null || restaurantName.trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant name cannot be empty");
        }

        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        Optional<Restaurant> restaurantOpt = restaurantRepository.findFirstByName(restaurantName);
        if (restaurantOpt.isEmpty()) {
            logger.error("Restaurant not found: {}", restaurantName);
            throw new ResourceNotFoundException("Restaurant not found: " + restaurantName);
        }

        Restaurant restaurant = restaurantOpt.get();
        String restaurantId = restaurant.getId();

        OrderFactory factory = factoryRegistry.getFactory(restaurantName);
        if (factory == null) {
            logger.error("No factory found for restaurant: {}", restaurantName);
            throw new IllegalArgumentException("No factory found for restaurant: " + restaurantName);
        }

        try {
            // Use calculatedAmount instead of amount
            OrderEntity orderEntity = factory.createOrder(restaurantId, calculatedAmount, items);
            orderEntity = orderRepository.save(orderEntity);

            // Publish order created event to message queue
            messageSender.sendOrderStatusChangeEvent(orderEntity);

            // Send payment processing event if needed
            if (orderEntity.getStatus() == OrderStatus.CONFIRMED) {
                messageSender.sendPaymentProcessingEvent(orderEntity);
            }

            return orderEntity;
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<OrderEntity> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public OrderEntity getOrderById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }

        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<OrderEntity> getActiveOrders() {
        return orderRepository.findByStatusNotIn(List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED));
    }

    @Transactional
    public OrderEntity updateOrderStatus(String orderId, OrderStatus newStatus) {
        logger.info("Updating order {} status to {}", orderId, newStatus);

        if (orderId == null || orderId.trim().isEmpty()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }

        if (newStatus == null) {
            throw new IllegalArgumentException("New status cannot be null");
        }

        OrderEntity order = getOrderById(orderId);

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        // Update order status
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        // Save updated order
        order = orderRepository.save(order);

        // Publish order status update event
        messageSender.sendOrderStatusChangeEvent(order);

        return order;
    }

    @Transactional
    public OrderEntity cancelOrder(String orderId) {
        logger.info("Cancelling order: {}", orderId);

        OrderEntity order = getOrderById(orderId);

        // Only allow cancellation for orders that haven't been delivered yet
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel order that has already been delivered");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        // Save cancelled order
        order = orderRepository.save(order);

        // Publish order cancelled event
        messageSender.sendOrderStatusChangeEvent(order);

        // If payment was processed, send refund event
        if (order.getPaymentDetails() != null &&
                order.getPaymentDetails().getStatus() != null &&
                order.getPaymentDetails().getStatus().toString().equals("COMPLETED")) {
            messageSender.sendPaymentRefundEvent(order);
        }

        return order;
    }

    // Helper method to validate status transitions
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Implement business rules for valid status transitions
        if (currentStatus == OrderStatus.DELIVERED || currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot change status of an order that is already " + currentStatus);
        }

        // Add more transition rules as needed
        // For example: CREATED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP -> IN_TRANSIT -> DELIVERED

        // For now, just a basic validation
        if (currentStatus.ordinal() > newStatus.ordinal()) {
            throw new IllegalStateException(
                    "Cannot change order status from " + currentStatus + " to " + newStatus);
        }
    }
    private double calculateOrderTotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}