package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.DeliveryDetails;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * McDonaldsOrderFactory is a concrete implementation of the OrderFactory interface.
 * It creates orders specific to McDonald's with additional validation and processing.
 */
public class McDonaldsOrderFactory implements OrderFactory {

    // Constants for McDonald's specific order processing
    private static final double MIN_ORDER_VALUE = 5.0;

    // Standard preparation time for McDonald's orders in minutes
    private static final int STANDARD_PREP_TIME_MINUTES = 10;

    /**
     * Creates an order for McDonald's with specific validation and processing.
     *
     * @param restaurantId The ID of the restaurant
     * @param amount       The total amount of the order
     * @param items        The list of items in the order
     * @return A new OrderEntity object representing the order
     */
    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items) {
        // McDonald's specific validation
        if (amount < MIN_ORDER_VALUE) {
            throw new IllegalArgumentException("McDonald's orders must be at least $" + MIN_ORDER_VALUE);
        }

        // Create basic order
        OrderEntity order = new OrderEntity(restaurantId, amount, items);

        // Add McDonald's specific order processing
        order.setStatus(OrderStatus.CREATED); // McDonald's automatically confirms orders

        // Set McDonald's specific delivery details
        DeliveryDetails deliveryDetails = new DeliveryDetails();
        LocalDateTime estimatedDelivery = LocalDateTime.now().plusMinutes(STANDARD_PREP_TIME_MINUTES);
        deliveryDetails.setEstimatedDeliveryTime(estimatedDelivery);
        order.setDeliveryDetails(deliveryDetails);

        // Apply McDonald's discount for orders over $20
        if (amount > 20.0) {
            double discountedAmount = amount * 0.95; // 5% discount
            order.setTotalAmount(discountedAmount);
        }

        return order;
    }
}