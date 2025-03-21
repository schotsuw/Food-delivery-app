package com.foodfetch.backend.controller;

import com.foodfetch.backend.dto.OrderRequestDTO;
import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderRequestDTO request) {
        OrderEntity order = orderService.createOrder(
                request.getRestaurantName(),
                request.getAmount(),
                request.getItems()
        );
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderEntity>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/{orderId}/track")
    public ResponseEntity<OrderEntity> trackOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<OrderEntity>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }
}