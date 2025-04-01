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

/**
 * OrderService is a service class that provides methods to manage orders.
 * It uses OrderRepository and RestaurantRepository to perform CRUD operations on orders and restaurants.
 */
@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final FactoryRegistry factoryRegistry;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;

    // RabbitMQ message sender for order status changes and notifications
    private final RabbitMQOrderSender messageSender;

    /**
     * Constructor for OrderService
     *
     * @param factoryRegistry        FactoryRegistry to get the appropriate order factory
     * @param restaurantRepository   Repository to handle restaurant operations
     * @param orderRepository        Repository to handle order operations
     * @param messageSender          Message sender for RabbitMQ
     */
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

    /**
     * Creates a new order for a specific restaurant.
     *
     * @param restaurantName Name of the restaurant
     * @param items          List of order items
     * @return Created OrderEntity
     */
    @Transactional
    public OrderEntity createOrder(String restaurantName, List<OrderItem> items) {
        // Calculate the total amount from items
        double calculatedAmount = calculateOrderTotal(items);
        logger.info("Creating order for restaurant: {}", restaurantName);
        logger.info("Calculated amount: {}", calculatedAmount);

        if (restaurantName == null || restaurantName.trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant name cannot be empty");
        }

        if (items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Check if restaurant exists
        Optional<Restaurant> restaurantOpt = restaurantRepository.findFirstByName(restaurantName);
        if (restaurantOpt.isEmpty()) {
            logger.error("Restaurant not found: {}", restaurantName);
            throw new ResourceNotFoundException("Restaurant not found: " + restaurantName);
        }

        Restaurant restaurant = restaurantOpt.get();
        String restaurantId = restaurant.getId();

        // Get the appropriate factory for the restaurant
        OrderFactory factory = factoryRegistry.getFactory(restaurantName);
        if (factory == null) {
            logger.error("No factory found for restaurant: {}", restaurantName);
            throw new IllegalArgumentException("No factory found for restaurant: " + restaurantName);
        }

        // Create order using the factory
        try {
            OrderEntity orderEntity = factory.createOrder(restaurantId, calculatedAmount, items);
            orderEntity = orderRepository.save(orderEntity);

            // Publish order created event to message queue
            messageSender.sendOrderStatusChangeEvent(orderEntity);

            // Send notification for order creation
            messageSender.sendNotificationEvent(orderEntity);

            // Send payment processing event if needed
            if (orderEntity.getStatus() == OrderStatus.CREATED) {
                messageSender.sendPaymentProcessingEvent(orderEntity);
            }

            return orderEntity;
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves all orders with pagination.
     *
     * @param pageable Pagination information
     * @return Page of OrderEntity
     */
    @Transactional(readOnly = true)
    public Page<OrderEntity> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    /**
     * Retrieves an order by its ID.
     *
     * @param id ID of the order
     * @return OrderEntity with the specified ID
     */
    @Transactional(readOnly = true)
    public OrderEntity getOrderById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }

        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
    }

    /**
     * Retrieves all active orders (not delivered or cancelled).
     *
     * @return List of active OrderEntity
     */
    @Transactional(readOnly = true)
    public List<OrderEntity> getActiveOrders() {
        return orderRepository.findByStatusNotIn(List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED));
    }

    /**
     * Updates the status of an order.
     *
     * @param orderId   ID of the order
     * @param newStatus New status to set
     * @return Updated OrderEntity
     */
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

        // Now also send notification event
        messageSender.sendNotificationEvent(order);

        // Add this block to send tracking events when order is confirmed
        if (newStatus == OrderStatus.CONFIRMED) {
            // Set default location data if not available
            if (order.getRestaurantLatitude() == 0 && order.getRestaurantLongitude() == 0) {
                // Set some default values - replace with actual data if available
                order.setRestaurantLatitude(40.7128);  // Example: NYC coordinates
                order.setRestaurantLongitude(-74.0060);
            }

            if (order.getCustomerLatitude() == 0 && order.getCustomerLongitude() == 0) {
                // Set some default values - replace with actual data if available
                order.setCustomerLatitude(40.7308);  // Example: Different NYC coordinates
                order.setCustomerLongitude(-73.9973);
            }

            messageSender.sendTrackingEvent(order);
        }

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

        // Send notification for order cancellation
        messageSender.sendNotificationEvent(order);

        // If payment was processed, send refund event
        if (order.getPaymentDetails() != null &&
                order.getPaymentDetails().getStatus() != null &&
                order.getPaymentDetails().getStatus().toString().equals("COMPLETED")) {
            messageSender.sendPaymentRefundEvent(order);
        }

        return order;
    }

    /**
     * Validates the status transition based on business rules.
     *
     * @param currentStatus Current status of the order
     * @param newStatus     New status to set
     */
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Implement business rules for valid status transitions
        if (currentStatus == OrderStatus.DELIVERED || currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cannot change status of an order that is already " + currentStatus);
        }

        // transition rules
        // CREATED -> CONFIRMED -> PREPARING -> READY_FOR_PICKUP -> IN_TRANSIT -> DELIVERED

        if (currentStatus.ordinal() > newStatus.ordinal()) {
            throw new IllegalStateException(
                    "Cannot change order status from " + currentStatus + " to " + newStatus);
        }
    }

    /**
     * Calculates the total amount of the order based on items and their quantities.
     *
     * @param items List of order items
     * @return Total amount of the order
     */
    private double calculateOrderTotal(List<OrderItem> items) {
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public void completeOrder(String orderId) {
        Optional<OrderEntity> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isPresent()) {
            OrderEntity order = optionalOrder.get();
            order.setStatus(OrderStatus.DELIVERED);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            messageSender.sendNotificationEvent(order);
            logger.info("Order {} Status Updated to DELIVERED via Tracking Event", orderId);
        } else {
            logger.warn("Attempted to Complete Non-Existent Order: {}", orderId);
        }
    }
}