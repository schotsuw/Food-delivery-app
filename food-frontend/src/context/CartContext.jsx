// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Provider component
export const CartProvider = ({ children }) => {
    // Try to load cart from localStorage on initial render
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    // In CartContext.jsx
    const addToCart = (item) => {
        console.log('Adding to cart in context:', item.name);

        setCartItems(prevItems => {
            // Defensive check - stop if the item is malformed
            if (!item || !item.id) {
                console.error('Attempted to add invalid item to cart', item);
                return prevItems;
            }

            // Check if item already exists in cart
            const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex >= 0) {
                // Item exists, increase quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return updatedItems;
            } else {
                // Item doesn't exist, add to cart with quantity 1
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    // Update item quantity
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or negative
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } else {
            // Update quantity
            setCartItems(prevItems =>
                prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
            );
        }
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Toggle cart
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Calculate total items and price
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Value to be provided by the context
    const value = {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleCart,
        totalItems,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};