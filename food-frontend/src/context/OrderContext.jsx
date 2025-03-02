import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();

  const createOrder = (cartItems, total) => {
    const orderId = `FD${Math.floor(Math.random() * 1000000)}`;
    const newOrder = {
      orderId,
      items: [...cartItems],
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      restaurant: "McDonald's Fredericton", // This could come from your state
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
    return orderId;
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
  
  // Add the cancelOrder function
  const cancelOrder = async (orderId, reason) => {
    try {
      // In a real application, you would make an API call here
      // For now, we'll just update the local state
      
      setActiveOrders(prev => 
        prev.map(order => 
          order.orderId === orderId ? 
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
    return activeOrders.find(order => order.orderId === orderId) || null;
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
      currentOrderId,
      hasActiveOrders,
      cancelOrder // Add the cancelOrder function to the context
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);