package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderItem;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class OrderRequestDTOTest {

    @Test
    public void testConstructorAndGetters() {
        List<OrderItem> items = Arrays.asList(
            new OrderItem("item1", "Burger", 2, 5.99, "No pickles"),
            new OrderItem("item2", "Fries", 1, 2.49, "Extra crispy")
        );

        OrderRequestDTO dto = new OrderRequestDTO("MyRestaurant", items, "Credit Card", "123 Main St");

        assertEquals("MyRestaurant", dto.getRestaurantName());
        assertEquals(items, dto.getItems());
        assertEquals("Credit Card", dto.getPaymentMethod());
        assertEquals("123 Main St", dto.getDeliveryAddress());
    }

    @Test
    public void testSetters() {
        OrderRequestDTO dto = new OrderRequestDTO();

        List<OrderItem> items = Arrays.asList(
            new OrderItem("item1", "Soda", 1, 1.99, "")
        );

        dto.setRestaurantName("Testaurant");
        dto.setItems(items);
        dto.setPaymentMethod("Debit");
        dto.setDeliveryAddress("456 Test Blvd");

        assertEquals("Testaurant", dto.getRestaurantName());
        assertEquals(items, dto.getItems());
        assertEquals("Debit", dto.getPaymentMethod());
        assertEquals("456 Test Blvd", dto.getDeliveryAddress());
    }

    @Test
    public void testEqualsAndHashCode() {
        List<OrderItem> items = Arrays.asList(
            new OrderItem("item1", "Burger", 2, 5.99, "No pickles")
        );

        OrderRequestDTO dto1 = new OrderRequestDTO("MyRestaurant", items, "Credit Card", "123 Main St");
        OrderRequestDTO dto2 = new OrderRequestDTO("MyRestaurant", items, "Credit Card", "123 Main St");

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
}
