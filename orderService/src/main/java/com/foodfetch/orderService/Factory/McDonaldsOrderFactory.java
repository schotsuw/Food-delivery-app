package com.foodfetch.orderService.Factory;

import com.foodfetch.orderService.model.DeliveryDetails;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class McDonaldsOrderFactory implements OrderFactory {

    private static final double MIN_ORDER_VALUE = 5.0;
    private static final int STANDARD_PREP_TIME_MINUTES = 10;

    @Override
    public OrderEntity createOrder(String restaurantId, double amount, List<OrderItem> items) {
        // McDonald's specific validation
        if (amount < MIN_ORDER_VALUE) {
            throw new IllegalArgumentException("McDonald's orders must be at least $" + MIN_ORDER_VALUE);
        }

        // Create basic order
        OrderEntity order = new OrderEntity(restaurantId, amount, items);

        // Add McDonald's specific order processing
        order.setStatus(OrderStatus.CONFIRMED); // McDonald's automatically confirms orders

        // Set McDonald's specific delivery details
        DeliveryDetails deliveryDetails = new DeliveryDetails();
        LocalDateTime estimatedDelivery = LocalDateTime.now().plusMinutes(STANDARD_PREP_TIME_MINUTES);
        deliveryDetails.setEstimatedDeliveryTime(estimatedDelivery);
        order.setDeliveryDetails(deliveryDetails);

        // Apply McDonald's discount for orders over $20
        if (amount > 20.0) {
            double discountedAmount = amount * 0.95; // 5% discount
            order.setAmount(discountedAmount);
        }

        return order;
    }
}