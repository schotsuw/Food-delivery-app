package com.foodfetch.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class OrderEntity {
    @Id
    private String id;
    private String customerId;
    private String restaurantId;
    private List<OrderItem> items;
    private OrderStatus status;
    private double amount;
    private PaymentDetails paymentDetails;
    private DeliveryDetails deliveryDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderEntity(String restaurantId, double amount, List<OrderItem> items) {
        this.restaurantId = restaurantId;
        this.amount = amount;
        this.items = items;
        this.status = OrderStatus.CREATED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}