import React from 'react'
import RestaurantCard from './RestaurantCard'
import restaurants from '../restaurants.json'

const RestaurantCards = () => {
  return (
    <>
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Restaurants</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}

        </div>
      </section>
    </>
  )
}

export default RestaurantCards