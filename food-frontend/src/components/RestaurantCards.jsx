// src/components/RestaurantCards.jsx
import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { restaurantApi } from '../services/api';
import { CircularProgress, Alert } from '@mui/material';

const RestaurantCards = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await restaurantApi.getAllRestaurants();
                setRestaurants(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to load restaurants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-4">
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    return (
        <>
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-8">Restaurants</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}

                </div>
            </section>
        </>
    );
};

export default RestaurantCards;