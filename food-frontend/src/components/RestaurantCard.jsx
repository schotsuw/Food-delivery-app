// src/components/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RestaurantCard = ({ restaurant }) => {
    // Create a URL-friendly slug from the restaurant ID or name
    const restaurantSlug = restaurant.id || restaurant.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <Link to={`/restaurant/${restaurantSlug}`}>
            <motion.div
                className="rounded-xl overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                }}
            >
                {/* Logo */}
                <div className={`w-full h-32 flex items-center justify-center overflow-hidden bg-gray-200 relative`}>
                    <motion.img
                        src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                        alt={restaurant.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Restaurant Info */}
                <div className="bg-gray-100 p-4 text-center">
                    <p className="text-lg font-semibold text-gray-800">{restaurant.name}</p>
                    <div>
                        <p className="text-sm text-gray-600">{restaurant.location || 'Location info unavailable'}</p>
                        <p className="text-xs text-gray-500">{restaurant.hours || 'Hours info unavailable'}</p>
                    </div>

                    {/* Add rating and delivery time if available */}
                    {restaurant.rating && (
                        <motion.div
                            className="mt-2 flex justify-center items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm ml-1">{restaurant.rating}</span>
                            {restaurant.deliveryTime && (
                                <span className="text-sm text-gray-500 ml-2">• {restaurant.deliveryTime} min</span>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
};

export default RestaurantCard;