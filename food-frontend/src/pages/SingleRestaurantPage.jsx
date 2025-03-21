import React from 'react';
import { useParams } from 'react-router-dom';
import restaurants from '../restaurants.json';

const SingleRestaurantPage = () => {
  const { restaurantSlug } = useParams();

  // Find the restaurant using the slug
  const restaurant = restaurants.find(
    (rest) => rest.name.toLowerCase().replace(/\s+/g, '-') === restaurantSlug
  );

  if (!restaurant) {
    return <p className="text-center text-red-500">Restaurant not found!</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <img src={restaurant.logo} alt={restaurant.name} className="w-64 h-64 object-cover rounded-lg" />
      <p className="mt-4 text-gray-700">{restaurant.description}</p>
      <p className="text-gray-500">Location: {restaurant.location}</p>
      <p className="text-gray-500">Hours: {restaurant.hours}</p>
    </div>
  );
};

export default SingleRestaurantPage;
