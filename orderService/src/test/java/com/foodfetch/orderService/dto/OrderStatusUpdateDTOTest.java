package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class OrderStatusUpdateDTOTest {

    @Test
    public void testConstructorAndGetters() {
        OrderStatus status = OrderStatus.CANCELLED;
        String reason = "Customer requested cancellation";

        OrderStatusUpdateDTO dto = new OrderStatusUpdateDTO(status, reason);

        assertEquals(status, dto.getStatus());
        assertEquals(reason, dto.getReason());
    }

    @Test
    public void testSetters() {
        OrderStatusUpdateDTO dto = new OrderStatusUpdateDTO();

        dto.setStatus(OrderStatus.DELIVERED);
        dto.setReason("Order completed successfully");

        assertEquals(OrderStatus.DELIVERED, dto.getStatus());
        assertEquals("Order completed successfully", dto.getReason());
    }

    @Test
    public void testEqualsAndHashCode() {
        OrderStatusUpdateDTO dto1 = new OrderStatusUpdateDTO(OrderStatus.PREPARING, "Cooking in progress");
        OrderStatusUpdateDTO dto2 = new OrderStatusUpdateDTO(OrderStatus.PREPARING, "Cooking in progress");

        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
}
