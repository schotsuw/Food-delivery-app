package com.foodfetch.orderService.Service;

import com.foodfetch.orderService.Factory.FactoryRegistry;
import com.foodfetch.orderService.Factory.OrderFactory;
import com.foodfetch.orderService.Repository.OrderRepository;
import com.foodfetch.orderService.Repository.RestaurantRepository;
import com.foodfetch.orderService.exception.OrderNotFoundException;
import com.foodfetch.orderService.exception.ResourceNotFoundException;
import com.foodfetch.orderService.messaging.RabbitMQOrderSender;
import com.foodfetch.orderService.model.OrderEntity;
import com.foodfetch.orderService.model.OrderItem;
import com.foodfetch.orderService.model.OrderStatus;
import com.foodfetch.orderService.model.Restaurant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private FactoryRegistry factoryRegistry;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RabbitMQOrderSender messageSender;

    @Mock
    private OrderFactory orderFactory;

    private Restaurant mockRestaurant;
    private OrderEntity mockOrder;
    private List<OrderItem> mockItems;

    @BeforeEach
    void setup() {
        mockRestaurant = new Restaurant();
        mockRestaurant.setId("rest1");
        mockRestaurant.setName("Pizza Place");

        mockItems = List.of(
            new OrderItem("item1", "Pizza", 2, 9.99, "")
        );

        mockOrder = new OrderEntity();
        mockOrder.setId("order123");
        mockOrder.setRestaurantId("rest1");
        mockOrder.setStatus(OrderStatus.CREATED);
        mockOrder.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testCreateOrder_Success() {
        when(restaurantRepository.findFirstByName("Pizza Place")).thenReturn(Optional.of(mockRestaurant));
        when(factoryRegistry.getFactory("Pizza Place")).thenReturn(orderFactory);
        when(orderFactory.createOrder("rest1", 19.98, mockItems)).thenReturn(mockOrder);
        when(orderRepository.save(mockOrder)).thenReturn(mockOrder);

        OrderEntity result = orderService.createOrder("Pizza Place", mockItems);

        assertNotNull(result);
        assertEquals("order123", result.getId());
        verify(messageSender).sendOrderStatusChangeEvent(mockOrder);
        verify(messageSender).sendNotificationEvent(mockOrder);
        verify(messageSender).sendPaymentProcessingEvent(mockOrder);
    }

    @Test
    void testCreateOrder_ThrowsIfRestaurantMissing() {
        when(restaurantRepository.findFirstByName("Missing")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.createOrder("Missing", mockItems);
        });
    }

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));

        OrderEntity result = orderService.getOrderById("order123");

        assertEquals("order123", result.getId());
    }

    @Test
    void testGetOrderById_NotFound() {
        when(orderRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThrows(OrderNotFoundException.class, () -> {
            orderService.getOrderById("unknown");
        });
    }

    @Test
    void testGetAllOrders_ReturnsPage() {
        Page<OrderEntity> mockPage = new PageImpl<>(List.of(mockOrder));
        when(orderRepository.findAll(any(Pageable.class))).thenReturn(mockPage);

        Page<OrderEntity> result = orderService.getAllOrders(Pageable.unpaged());

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetActiveOrders() {
        when(orderRepository.findByStatusNotIn(anyList())).thenReturn(List.of(mockOrder));

        List<OrderEntity> activeOrders = orderService.getActiveOrders();

        assertEquals(1, activeOrders.size());
    }

    @Test
    void testUpdateOrderStatus_ValidTransition() {
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        OrderEntity updated = orderService.updateOrderStatus("order123", OrderStatus.CONFIRMED);

        assertEquals(OrderStatus.CONFIRMED, updated.getStatus());
        verify(messageSender).sendOrderStatusChangeEvent(any());
        verify(messageSender).sendNotificationEvent(any());
    }

    @Test
    void testUpdateOrderStatus_InvalidTransition() {
        mockOrder.setStatus(OrderStatus.DELIVERED);
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));

        assertThrows(IllegalStateException.class, () ->
            orderService.updateOrderStatus("order123", OrderStatus.CANCELLED));
    }

    @Test
    void testCancelOrder_Successful() {
        mockOrder.setStatus(OrderStatus.CONFIRMED);
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        OrderEntity cancelled = orderService.cancelOrder("order123");

        assertEquals(OrderStatus.CANCELLED, cancelled.getStatus());
        verify(messageSender).sendOrderStatusChangeEvent(cancelled);
        verify(messageSender).sendNotificationEvent(cancelled);
    }
}
