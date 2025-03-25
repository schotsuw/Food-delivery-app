// src/services/OrderService.js
import api from './api';

/**
 * Service for handling order-related operations
 */
class OrderService {
    /**
     * Create a new order
     * @param {Object} orderData - The order data
     * @returns {Promise} - Promise resolved with the created order
     */
    createOrder(orderData) {
        return api.post('/orders', orderData);
    }

    /**
     * Get order by ID
     * @param {string} orderId - The order ID
     * @returns {Promise} - Promise resolved with the order data
     */
    getOrderById(orderId) {
        return api.get(`/orders/${orderId}`);
    }

    /**
     * Update order status
     * @param {string} orderId - The order ID
     * @param {string} status - The new status
     * @returns {Promise} - Promise resolved with the updated order
     */
    updateOrderStatus(orderId, status) {
        return api.put(`/orders/${orderId}/status`, { status });
    }

    /**
     * Get active orders for the current user
     * @returns {Promise} - Promise resolved with active orders
     */
    getActiveOrders() {
        return api.get('/orders/active');
    }

    /**
     * Cancel an order
     * @param {string} orderId - The order ID
     * @returns {Promise} - Promise resolved with the cancelled order
     */
    cancelOrder(orderId) {
        return api.post(`/orders/${orderId}/cancel`);
    }
}

export default new OrderService();