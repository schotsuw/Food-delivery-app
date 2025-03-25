package com.foodfetch.orderService.dto;

import com.foodfetch.orderService.model.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateDTO {
    private OrderStatus status;
    private String reason;
}
