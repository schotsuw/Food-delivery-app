package com.foodfetch.orderService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodfetch.orderService.Service.OrderService;
import com.foodfetch.orderService.dto.OrderRequestDTO;
import com.foodfetch.orderService.dto.OrderStatusUpdateDTO;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    private OrderEntity mockOrder;

    @BeforeEach
    public void setup() {
        mockOrder = new OrderEntity();
        mockOrder.setId("order123");
        mockOrder.setRestaurantId("Burger Place");
        mockOrder.setStatus(OrderStatus.CREATED);
    }

    @Test
    public void testCreateOrder() throws Exception {
        OrderRequestDTO requestDTO = new OrderRequestDTO();
        requestDTO.setRestaurantName("Burger Place");

        Mockito.when(orderService.createOrder(any(), any())).thenReturn(mockOrder);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"))
                .andExpect(jsonPath("$.restaurantId").value("Burger Place"));
    }

    @Test
    public void testGetAllOrders() throws Exception {
        Page<OrderEntity> mockPage = new PageImpl<>(List.of(mockOrder));

        Mockito.when(orderService.getAllOrders(any(Pageable.class))).thenReturn(mockPage);

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value("order123"));
    }

    @Test
    public void testGetOrderById() throws Exception {
        Mockito.when(orderService.getOrderById("order123")).thenReturn(mockOrder);

        mockMvc.perform(get("/api/orders/order123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"));
    }

    @Test
    public void testUpdateOrderStatus() throws Exception {
        OrderStatusUpdateDTO statusDTO = new OrderStatusUpdateDTO(OrderStatus.DELIVERED, "Delivered successfully");

        Mockito.when(orderService.updateOrderStatus(eq("order123"), eq(OrderStatus.DELIVERED)))
                .thenReturn(mockOrder);

        mockMvc.perform(put("/api/orders/order123/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"));
    }

    @Test
    public void testCancelOrder() throws Exception {
        Mockito.when(orderService.cancelOrder("order123")).thenReturn(mockOrder);

        mockMvc.perform(post("/api/orders/order123/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"));
    }

    @Test
    public void testGetActiveOrders() throws Exception {
        Mockito.when(orderService.getActiveOrders()).thenReturn(List.of(mockOrder));

        mockMvc.perform(get("/api/orders/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("order123"));
    }
}
