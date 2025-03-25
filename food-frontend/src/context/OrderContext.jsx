import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const navigate = useNavigate();

    // Updated to accept a full orderData object instead of just cartItems and total
    const createOrder = (orderData) => {
        const orderId = `FD${Math.floor(Math.random() * 1000000)}`;

        // Extract restaurant name from the first item or use the provided restaurantName
        const restaurantName = orderData.restaurantName ||
            (orderData.items[0]?.restaurantName || "Restaurant");

        const newOrder = {
            orderId,
            id: orderId, // Adding id property for consistency with OrderConfirmation
            items: [...orderData.items],
            subtotal: orderData.subtotal || orderData.total, // Support both properties
            tax: orderData.tax || (orderData.total * 0.08),
            deliveryFee: orderData.deliveryFee || 2.99,
            total: orderData.total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            restaurantName: restaurantName,
            email: orderData.customerEmail || orderData.email,
            deliveryAddress: orderData.deliveryAddress || orderData.address,
            steps: [
                { label: "Order Confirmed", description: "Your order has been received", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: false },
                { label: "Preparing", description: "Restaurant is preparing your food", time: "", completed: false },
                { label: "On the Way", description: "Your order is on the way", time: "", completed: false },
                { label: "Delivered", description: "Enjoy your meal!", time: "", completed: false }
            ],
            rider: { name: "John Doe", image: "/placeholder-rider.jpg", rating: 4.8 }
        };

        setActiveOrders(prev => [...prev, newOrder]);
        setCurrentOrderId(orderId);

        // Return the full order object instead of just the ID
        return newOrder;
    };

    const confirmPayment = (orderId) => {
        setActiveOrders(prev =>
            prev.map(order =>
                order.orderId === orderId ?
                    {
                        ...order,
                        status: 'confirmed',
                        steps: order.steps.map((step, index) =>
                            index === 0 ? {...step, completed: true} : step
                        )
                    } : order
            )
        );

        // Navigate to tracking page after payment confirmation
        navigate(`/track-order/${orderId}`);
    };

    // Handle tracking order - combines looking up the order and possibly creating a mock one
    const trackOrder = (orderId) => {
        const existingOrder = getOrder(orderId);
        if (existingOrder) {
            return existingOrder;
        }

        // If order not found, we could either return null or create a mock order for demo
        // For a real app, you'd want to fetch from the server instead
        return null;
    };

    // Add the cancelOrder function
    const cancelOrder = async (orderId, reason) => {
        try {
            // In a real application, you would make an API call here
            // For now, we'll just update the local state

            setActiveOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId || order.id === orderId ?
                        {
                            ...order,
                            status: 'cancelled',
                            cancellationReason: reason,
                            cancelledAt: new Date().toISOString()
                        } : order
                )
            );

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // After successful cancellation, clear the current order ID if it matches
            if (currentOrderId === orderId) {
                setCurrentOrderId(null);
            }

            // Optional: Navigate away from the tracking page
            // Uncomment if you want automatic redirection after cancellation
            // navigate('/orders-history');

            return true;
        } catch (error) {
            console.error("Error cancelling order:", error);
            return false;
        }
    };

    const getOrder = (orderId) => {
        return activeOrders.find(order =>
            order.orderId === orderId || order.id === orderId
        ) || null;
    };

    const hasActiveOrders = () => {
        return activeOrders.length > 0;
    };

    return (
        <OrderContext.Provider value={{
            activeOrders,
            createOrder,
            confirmPayment,
            getOrder,
            trackOrder,
            currentOrderId,
            hasActiveOrders,
            cancelOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);