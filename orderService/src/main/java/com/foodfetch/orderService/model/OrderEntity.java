package com.foodfetch.orderService.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

/**
 * OrderEntity is a class that represents an order in the system.
 * It contains information about the order ID, customer ID, restaurant ID, list of items,
 * order status, total amount, payment details, delivery details, and timestamps for creation and update.
 */
@Data
@Document(collection = "orders") // MongoDB collection name
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {
    @Id
    private String id;
    private String customerId;
    private String restaurantId;
    private List<OrderItem> items;
    private OrderStatus status;
    private double totalAmount;
    private PaymentDetails paymentDetails;
    private DeliveryDetails deliveryDetails;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private double restaurantLatitude;
    private double restaurantLongitude;
    private double customerLatitude;
    private double customerLongitude;
    /**
     * Constructor to create an OrderEntity with the specified restaurant ID, total amount, and list of items.
     *
     * @param restaurantId the ID of the restaurant
     * @param totalAmount  the total amount of the order
     * @param items        the list of items in the order
     */
    public OrderEntity(String restaurantId, double totalAmount, List<OrderItem> items) {
        this.restaurantId = restaurantId;
        this.totalAmount = totalAmount;
        this.items = items;
        this.status = OrderStatus.CREATED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

}