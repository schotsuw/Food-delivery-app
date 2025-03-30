// src/components/RestaurantCards.jsx
import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { restaurantApi } from '../services/api';
import { CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

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

    // Animation variants for staggered animation
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CircularProgress />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="my-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Alert severity="error">{error}</Alert>
            </motion.div>
        );
    }

    return (
        <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >


            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {restaurants.map((restaurant, index) => (
                    <motion.div
                        key={restaurant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                        }}
                    >
                        <RestaurantCard restaurant={restaurant} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default RestaurantCards;