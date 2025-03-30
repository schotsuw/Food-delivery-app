// src/services/api.js
import axios from 'axios';
import { mockRestaurantApi } from './mockApi';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api', // This will be proxied to your API Gateway running on http://localhost:8080/api
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors (401, 403, 500, etc.)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }

            if (status === 403) {
                // Forbidden - user doesn't have required permissions
                console.error('You do not have permission to access this resource');
            }
        }

        return Promise.reject(error);
    }
);

// Flag to control whether to use mock API or real API
const USE_MOCK_API = false; // Set to false to use your real Spring Boot API

// Restaurant related API calls with fallback to mock
export const restaurantApi = {
    getAllRestaurants: async () => {
        if (USE_MOCK_API) {
            return mockRestaurantApi.getAllRestaurants();
        }
        try {
            return await api.get('/restaurants');
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            // Fallback to mock data if real API fails
            console.warn('Falling back to mock data');
            return mockRestaurantApi.getAllRestaurants();
        }
    },

    getRestaurantById: async (id) => {
        if (USE_MOCK_API) {
            return mockRestaurantApi.getRestaurantById(id);
        }
        try {
            return await api.get(`/restaurants/${id}`);
        } catch (error) {
            console.error(`Error fetching restaurant ${id}:`, error);
            // Fallback to mock data if real API fails
            console.warn('Falling back to mock data');
            return mockRestaurantApi.getRestaurantById(id);
        }
    },

    getMenuByRestaurant: async (restaurantId) => {
        if (USE_MOCK_API) {
            return mockRestaurantApi.getMenuByRestaurant(restaurantId);
        }
        try {
            return await api.get(`/menu/restaurants/${restaurantId}`);
        } catch (error) {
            console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
            // Fallback to mock data if real API fails
            console.warn('Falling back to mock data');
            return mockRestaurantApi.getMenuByRestaurant(restaurantId);
        }
    },

    // New methods for CRUD operations
    createRestaurant: (restaurantData) => {
        return api.post('/restaurants', restaurantData);
    },

    updateRestaurant: (id, restaurantData) => {
        return api.put(`/restaurants/${id}`, restaurantData);
    },

    deleteRestaurant: (id) => {
        return api.delete(`/restaurants/${id}`);
    },

    // Menu item operations
    createMenuItem: (restaurantId, menuItemData) => {
        return api.post(`/restaurants/${restaurantId}/menu`, menuItemData);
    },

    updateMenuItem: (restaurantId, menuItemId, menuItemData) => {
        return api.put(`/restaurants/${restaurantId}/menu/${menuItemId}`, menuItemData);
    },

    deleteMenuItem: (restaurantId, menuItemId) => {
        return api.delete(`/restaurants/${restaurantId}/menu/${menuItemId}`);
    }
};

// Order related API calls
export const orderApi = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getOrderById: (orderId) => api.get(`/orders/${orderId}`),
    updateOrderStatus: (orderId, status) =>
        api.put(`/orders/${orderId}/status`, { status }),
    cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
    getActiveOrders: () => api.get('/orders/active'),
    getAllOrders: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
        api.get(`/orders?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
};

// Payment related API calls
export const paymentApi = {
    processPayment: (orderEvent) => api.post('/payments/test-payment', orderEvent),
    getPaymentById: (id) => api.get(`/payments/${id}`),
    getPaymentByTransactionId: (transactionId) =>
        api.get(`/payments/transaction/${transactionId}`),
};

// Auth related API calls
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

export default api;