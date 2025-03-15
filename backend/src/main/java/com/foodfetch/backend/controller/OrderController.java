package com.foodfetch.backend.controller;

import com.foodfetch.backend.dto.OrderRequestDTO;
import com.foodfetch.backend.model.OrderEntity;
import com.foodfetch.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderEntity createOrder(@RequestBody OrderRequestDTO request) {
        return orderService.createOrder(request.getRestaurant(), request.getAmount(), request.getItems());
    }
}
