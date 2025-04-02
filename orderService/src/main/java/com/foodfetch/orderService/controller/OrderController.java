package com.foodfetch.orderService.controller;

import com.foodfetch.orderService.dto.OrderRequestDTO;
import com.foodfetch.orderService.dto.OrderStatusUpdateDTO;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderStatus;
import com.foodfetch.orderService.Service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * OrderController handles HTTP requests related to order operations.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    /**
     * Constructor for OrderController
     *
     * @param orderService Service to handle order-related operations
     */
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Endpoint to create a new order
     *
     * @param request OrderRequestDTO containing order details
     * @return Created OrderEntity
     */
    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderRequestDTO request) {
        try {
            OrderEntity order = orderService.createOrder(
                    request.getRestaurantName(),
                    request.getItems()
            );
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid order request: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating order", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create order: " + e.getMessage());
        }
    }

    /**
     * Endpoint to retrieve all orders with pagination and sorting
     *
     * @param page Page number
     * @param size Number of items per page
     * @param sortBy Field to sort by
     * @param sortDir Sort direction (asc or desc)
     * @return Page of OrderEntity
     */
    @GetMapping
    public ResponseEntity<Page<OrderEntity>> getAllOrders(
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size,
        @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
        @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir) {

        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDir);
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<OrderEntity> orders = orderService.getAllOrders(pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error retrieving orders", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve orders: " + e.getMessage());
        }
    }

    /**
     * Endpoint to retrieve an order by its ID
     *
     * @param orderId ID of the order
     * @return OrderEntity with the specified ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable(name = "orderId") String orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(orderId));
        } catch (Exception e) {
            logger.error("Error retrieving order {}", orderId, e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Endpoint to update the status of an order
     *
     * @param orderId ID of the order
     * @param statusUpdate OrderStatusUpdateDTO containing the new status
     * @return Updated OrderEntity
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderEntity> updateOrderStatus(
            @PathVariable(name = "orderId") String orderId,
            @RequestBody OrderStatusUpdateDTO statusUpdate) {

        try {
            OrderStatus newStatus = statusUpdate.getStatus();
            OrderEntity updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Invalid status update for order {}: {}", orderId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating order status for {}", orderId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to update order status: " + e.getMessage());
        }
    }

    /**
     * Endpoint to cancel an order
     *
     * @param orderId ID of the order
     * @return Cancelled OrderEntity
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderEntity> cancelOrder(@PathVariable(name = "orderId") String orderId) {
        try {
            OrderEntity cancelledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (IllegalStateException e) {
            logger.error("Cannot cancel order {}: {}", orderId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            logger.error("Error cancelling order {}", orderId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to cancel order: " + e.getMessage());
        }
    }

    /**
     * Endpoint to retrieve all active orders
     *
     * @return List of active OrderEntity
     */
    @GetMapping("/active")
    public ResponseEntity<List<OrderEntity>> getActiveOrders() {
        try {
            return ResponseEntity.ok(orderService.getActiveOrders());
        } catch (Exception e) {
            logger.error("Error retrieving active orders", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve active orders: " + e.getMessage());
        }
    }
}