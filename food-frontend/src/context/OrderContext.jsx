import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load active orders when component mounts
    useEffect(() => {
        fetchActiveOrders();
    }, []);

    const fetchActiveOrders = async () => {
        setLoading(true);
        try {
            const response = await OrderService.getActiveOrders();
            setActiveOrders(response.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching active orders:", err);
            // Create some sample orders for demo purposes when backend is not available
            const sampleOrders = [];
            setActiveOrders(sampleOrders);
        } finally {
            setLoading(false);
        }
    };

    // Create a new order using backend API
    const createOrder = async (orderData) => {
        setLoading(true);
        try {
            // Format data for backend
            // Format data for backend (around line 31)
            const requestData = {
                restaurantName: orderData.restaurantName,
                items: orderData.items.map(item => ({
                    itemId: item.id,         // Change from menuItemId to itemId
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1
                })),
                paymentMethod: "CREDIT_CARD", // Add this
                deliveryAddress: orderData.deliveryAddress || orderData.address
                // Remove customerEmail since it's not in your DTO
            };

            // Call backend API
            const response = await OrderService.createOrder(requestData);
            const createdOrder = response.data;

            // For frontend usage, create a user-friendly order object with all needed fields
            const frontendOrder = {
                orderId: createdOrder.id,
                id: createdOrder.id,
                items: orderData.items,
                restaurantName: orderData.restaurantName,
                subtotal: orderData.subtotal,
                tax: orderData.tax,
                deliveryFee: orderData.deliveryFee,
                total: createdOrder.amount || orderData.total,
                status: createdOrder.status || 'CONFIRMED',
                createdAt: createdOrder.createdAt || new Date().toISOString(),
                email: orderData.customerEmail || orderData.email,
                deliveryAddress: orderData.deliveryAddress || orderData.address,
                steps: [
                    {
                        label: "Order Confirmed",
                        description: "Your order has been received",
                        time: new Date(createdOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        completed: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED'].includes(createdOrder.status)
                    },
                    {
                        label: "Preparing",
                        description: "Restaurant is preparing your food",
                        time: "",
                        completed: ['PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED'].includes(createdOrder.status)
                    },
                    {
                        label: "On the Way",
                        description: "Your order is on the way",
                        time: "",
                        completed: ['IN_TRANSIT', 'DELIVERED'].includes(createdOrder.status)
                    },
                    {
                        label: "Delivered",
                        description: "Enjoy your meal!",
                        time: "",
                        completed: ['DELIVERED'].includes(createdOrder.status)
                    }
                ],
                rider: {
                    name: "John Doe",
                    image: "/placeholder-rider.jpg",
                    rating: 4.8
                }
            };

            // Add to active orders in state
            setActiveOrders(prev => [...prev, frontendOrder]);
            setCurrentOrderId(frontendOrder.id);
            setError(null);

            // Return the frontend-friendly order object
            return frontendOrder;
        } catch (err) {
            console.error("Error creating order:", err);
            setError("Failed to create order. Please try again.");

            // For demo purposes - create a mock order if backend fails
            const mockOrderId = `FD${Math.floor(Math.random() * 1000000)}`;
            const mockOrder = {
                orderId: mockOrderId,
                id: mockOrderId,
                items: orderData.items,
                restaurantName: orderData.restaurantName,
                subtotal: orderData.subtotal,
                tax: orderData.tax,
                deliveryFee: orderData.deliveryFee,
                total: orderData.total,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
                email: orderData.customerEmail || orderData.email,
                deliveryAddress: orderData.deliveryAddress || orderData.address,
                steps: [
                    {
                        label: "Order Confirmed",
                        description: "Your order has been received",
                        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        completed: true
                    },
                    {
                        label: "Preparing",
                        description: "Restaurant is preparing your food",
                        time: "",
                        completed: false
                    },
                    {
                        label: "On the Way",
                        description: "Your order is on the way",
                        time: "",
                        completed: false
                    },
                    {
                        label: "Delivered",
                        description: "Enjoy your meal!",
                        time: "",
                        completed: false
                    }
                ],
                rider: {
                    name: "John Doe",
                    image: "/placeholder-rider.jpg",
                    rating: 4.8
                }
            };

            setActiveOrders(prev => [...prev, mockOrder]);
            setCurrentOrderId(mockOrderId);

            return mockOrder;
        } finally {
            setLoading(false);
        }
    };

    // Confirm payment and update order status
    const confirmPayment = async (orderId) => {
        try {
            // Update order status in backend
            await OrderService.updateOrderStatus(orderId, "CONFIRMED");

            // Update in state
            setActiveOrders(prev =>
                prev.map(order =>
                    order.id === orderId || order.orderId === orderId ?
                        {
                            ...order,
                            status: 'CONFIRMED',
                            steps: order.steps.map((step, index) =>
                                index === 0 ? {...step, completed: true} : step
                            )
                        } : order
                )
            );
        } catch (err) {
            console.error("Error confirming payment:", err);
            // Silent fail - the UI will still update
        }

        // Navigate to tracking page
        navigate(`/track-order/${orderId}`);
    };

    // Track an order by ID
    const trackOrder = async (orderId) => {
        setLoading(true);
        try {
            // First check if it's in our active orders
            const existingOrder = getOrder(orderId);
            if (existingOrder) {
                return existingOrder;
            }

            // If not, try to fetch it from the backend
            const response = await OrderService.getOrderById(orderId);
            const backendOrder = response.data;

            // Transform backend data to frontend format
            const frontendOrder = {
                orderId: backendOrder.id,
                id: backendOrder.id,
                items: backendOrder.items || [],
                restaurantName: backendOrder.restaurantName,
                subtotal: backendOrder.subtotal,
                tax: backendOrder.tax,
                deliveryFee: backendOrder.deliveryFee,
                total: backendOrder.amount || backendOrder.total,
                status: backendOrder.status,
                createdAt: backendOrder.createdAt,
                email: backendOrder.customerEmail,
                deliveryAddress: backendOrder.deliveryAddress,
                steps: [
                    {
                        label: "Order Confirmed",
                        description: "Your order has been received",
                        time: new Date(backendOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        completed: ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(backendOrder.status)
                    },
                    {
                        label: "Preparing",
                        description: "Restaurant is preparing your food",
                        time: "",
                        completed: ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(backendOrder.status)
                    },
                    {
                        label: "On the Way",
                        description: "Your order is on the way",
                        time: "",
                        completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(backendOrder.status)
                    },
                    {
                        label: "Delivered",
                        description: "Enjoy your meal!",
                        time: "",
                        completed: ['DELIVERED'].includes(backendOrder.status)
                    }
                ],
                rider: {
                    name: "John Doe",
                    image: "/placeholder-rider.jpg",
                    rating: 4.8
                }
            };

            // Add to state
            setActiveOrders(prev => [...prev, frontendOrder]);
            setError(null);

            return frontendOrder;
        } catch (err) {
            console.error("Error tracking order:", err);
            setError("Order not found or could not be tracked");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Cancel an order
    const cancelOrder = async (orderId, reason) => {
        setLoading(true);
        try {
            // Call backend API
            await OrderService.cancelOrder(orderId);

            // Update in state
            setActiveOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId || order.id === orderId ?
                        {
                            ...order,
                            status: 'CANCELLED',
                            cancellationReason: reason,
                            cancelledAt: new Date().toISOString()
                        } : order
                )
            );

            // After successful cancellation, clear current order ID if it matches
            if (currentOrderId === orderId) {
                setCurrentOrderId(null);
            }

            setError(null);
            return true;
        } catch (error) {
            console.error("Error cancelling order:", error);
            setError("Failed to cancel order. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Get order by ID from state
    const getOrder = (orderId) => {
        return activeOrders.find(order =>
            order.orderId === orderId || order.id === orderId
        ) || null;
    };

    // Check if user has active orders
    const hasActiveOrders = () => {
        return activeOrders.length > 0;
    };

    return (
        <OrderContext.Provider value={{
            activeOrders,
            loading,
            error,
            createOrder,
            confirmPayment,
            getOrder,
            trackOrder,
            currentOrderId,
            hasActiveOrders,
            cancelOrder,
            refreshOrders: fetchActiveOrders
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);