package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.DeliveryDetails;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class WendysOrderFactory implements OrderFactory {

    private static final double MIN_ORDER_VALUE = 7.0;
    private static final int STANDARD_PREP_TIME_MINUTES = 15;

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