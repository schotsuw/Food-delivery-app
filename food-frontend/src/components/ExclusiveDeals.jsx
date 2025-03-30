
import { Button } from '@mui/material';

const categories = ['Vegan', 'Sushi', 'Pizza & Fast food', 'others'];

const exclusiveDeals = [
  {
    discount: '-40%',
    type: 'Restaurant',
    name: 'Chef Burgers London',
    image: ''
  },
  {
    discount: '-20%',
    type: 'Restaurant',
    name: 'Grand Ai Cafe London',
  },
  {
    discount: '-17%',
    type: 'Restaurant',
    name: 'Butterbrot Cafe London',
  }
];

const popularCategories = [
  { name: 'Burgers & Fast food', restaurants: 21 },
  { name: 'Salads', restaurants: 32 },
  { name: 'Pasta & Casuals', restaurants: 4 },
  { name: 'Pizza', restaurants: 32 },
  { name: 'Breakfast', restaurants: 4 },
  { name: 'Soups', restaurants: 32 }
];

export default function ExclusiveDeals() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Exclusive Deals Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Up to -40% 🎀 FoodFetch exclusive deals
          </h2>
          <div className="flex gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'Pizza & Fast food' ? 'outlined' : 'text'}
                className={`rounded-full ${
                  category === 'Pizza & Fast food'
                    ? '!border-primary !text-primary'
                    : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exclusiveDeals.map((deal) => (
            <div
              key={deal.name}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-4 right-4 bg-navy text-white px-3 py-1 rounded-lg">
                {deal.discount}
              </div>
              <img
                src={deal.image || "/placeholder.svg"}
                alt={deal.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <span className="text-primary">{deal.type}</span>
                <h3 className="text-white text-xl font-semibold">{deal.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-8">
          FoodFetch Popular Categories 😋
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-square rounded-full overflow-hidden mb-4">
                <img
                  src={`/placeholder-${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600">
                {category.restaurants} Restaurants
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}