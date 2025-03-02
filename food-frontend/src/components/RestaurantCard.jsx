import React from 'react'

const RestaurantCard = ({ restaurant }) => {
  console.log(restaurant.logo);
  return (
    <>
      <div
        key={restaurant.name}
        className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Restaurant Info */}
        <div className="bg-gray-100 p-4 text-center">
          <p className="text-lg font-semibold text-gray-800">{restaurant.name}</p>
          <p className="text-sm text-gray-600">{restaurant.location}</p>
          <p className="text-xs text-gray-500">{restaurant.hours}</p>
        </div>

      </div>
    </>
  )
}

export default RestaurantCard