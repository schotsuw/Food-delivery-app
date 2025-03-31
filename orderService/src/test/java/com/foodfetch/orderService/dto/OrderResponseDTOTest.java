package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class OrderResponseDTOTest {

    @Test
    public void testConstructorAndGetters() {
        String id = "order123";
        String restaurantName = "Tasty Treats";
        OrderStatus status = OrderStatus.PREPARING;
        double totalAmount = 15.99;
        String deliveryAddress = "123 Main St";
        LocalDateTime estimatedDeliveryTime = LocalDateTime.now().plusMinutes(30);

        OrderResponseDTO dto = new OrderResponseDTO(
                id,
                restaurantName,
                status,
                totalAmount,
                deliveryAddress,
                estimatedDeliveryTime
        );

        assertEquals(id, dto.getId());
        assertEquals(restaurantName, dto.getRestaurantName());
        assertEquals(status, dto.getStatus());
        assertEquals(totalAmount, dto.getTotalAmount());
        assertEquals(deliveryAddress, dto.getDeliveryAddress());
        assertEquals(estimatedDeliveryTime, dto.getEstimatedDeliveryTime());
    }

    @Test
    public void testSetters() {
        OrderResponseDTO dto = new OrderResponseDTO();

        String id = "order456";
        String restaurantName = "Good Eats";
        OrderStatus status = OrderStatus.DELIVERED;
        double totalAmount = 20.49;
        String deliveryAddress = "456 Elm St";
        LocalDateTime estimatedDeliveryTime = LocalDateTime.now().plusMinutes(45);

        dto.setId(id);
        dto.setRestaurantName(restaurantName);
        dto.setStatus(status);
        dto.setTotalAmount(totalAmount);
        dto.setDeliveryAddress(deliveryAddress);
        dto.setEstimatedDeliveryTime(estimatedDeliveryTime);

        assertEquals(id, dto.getId());
        assertEquals(restaurantName, dto.getRestaurantName());
        assertEquals(status, dto.getStatus());
        assertEquals(totalAmount, dto.getTotalAmount());
        assertEquals(deliveryAddress, dto.getDeliveryAddress());
        assertEquals(estimatedDeliveryTime, dto.getEstimatedDeliveryTime());
    }

    @Test
    public void testEqualsAndHashCode() {
        String id = "order789";
        String restaurantName = "Yummy Spot";
        OrderStatus status = OrderStatus.CREATED;
        double totalAmount = 12.50;
        String deliveryAddress = "789 Maple St";
        LocalDateTime estimatedDeliveryTime = LocalDateTime.now().plusMinutes(60);

        OrderResponseDTO dto1 = new OrderResponseDTO(
                id, restaurantName, status, totalAmount, deliveryAddress, estimatedDeliveryTime);
        OrderResponseDTO dto2 = new OrderResponseDTO(
                id, restaurantName, status, totalAmount, deliveryAddress, estimatedDeliveryTime);

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
}
