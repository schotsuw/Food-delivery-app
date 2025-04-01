package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.DeliveryDetails;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Wendy'sOrderFactory is a concrete implementation of the OrderFactory interface.
 * It creates orders specifically for Wendy's restaurant, applying specific rules and validations.
 */
public class WendysOrderFactory implements OrderFactory {

    // Constants for Wendy's specific order processing
    private static final double MIN_ORDER_VALUE = 7.0;
    // Standard preparation time for Wendy's orders in minutes
    private static final int STANDARD_PREP_TIME_MINUTES = 15;

    /**
     * Creates an order for Wendy's with specific validation and processing.
     *
     * @param restaurantId The ID of the restaurant
     * @param amount       The total amount of the order
     * @param items        The list of items in the order
     * @return A new OrderEntity object representing the order
     */
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items) {
        // Wendy's specific validation
        if (amount < MIN_ORDER_VALUE) {
            throw new IllegalArgumentException("Wendy's orders must be at least $" + MIN_ORDER_VALUE);
        }

        // Create basic order
        OrderEntity order = new OrderEntity(restaurantId, amount, items);

        // Add Wendy's specific order processing
        order.setStatus(OrderStatus.CREATED); // Wendy's requires manual confirmation
        order.setRestaurantLatitude(34.0522); // Example: Los Angeles
        order.setRestaurantLongitude(-118.2437);
        order.setCustomerLatitude(34.0522 + 0.01); // Nearby location
        order.setCustomerLongitude(-118.2437 + 0.01);
        // Set Wendy's specific delivery details
        DeliveryDetails deliveryDetails = new DeliveryDetails();
        LocalDateTime estimatedDelivery = LocalDateTime.now().plusMinutes(STANDARD_PREP_TIME_MINUTES);
        deliveryDetails.setEstimatedDeliveryTime(estimatedDelivery);
        order.setDeliveryDetails(deliveryDetails);

        // Apply Wendy's promotion - free delivery for orders over $25
        if (amount > 25.0) {
            deliveryDetails.setDeliveryFee(0.0);
        } else {
            deliveryDetails.setDeliveryFee(3.99);
        }

        return order;
    }
}