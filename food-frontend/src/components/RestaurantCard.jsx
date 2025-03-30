// src/components/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    // Create a URL-friendly slug from the restaurant ID or name
    const restaurantSlug = restaurant.id || restaurant.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <Link to={`/restaurant/${restaurantSlug}`}>
            <div
                className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
                {/* Logo */}
                <div className={`w-full h-32 flex items-center justify-center overflow-hidden bg-gray-200 relative`}>
                    <img
                        src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                        alt={restaurant.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
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
                        <div className="mt-2 flex justify-center items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm ml-1">{restaurant.rating}</span>
                            {restaurant.deliveryTime && (
                                <span className="text-sm text-gray-500 ml-2">• {restaurant.deliveryTime} min</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;