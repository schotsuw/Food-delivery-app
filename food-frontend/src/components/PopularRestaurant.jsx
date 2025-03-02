

const popularRestaurants = [
  {
    name: "McDonald's London",
    logo: "../assets/McDonalds.png",
    bgColor: "bg-[#DA291C]"
  },
  {
    name: "Papa Johns",
    logo: "/logos/papa-johns.png",
    bgColor: "bg-[#2D6737]"
  },
  {
    name: "KFC West London",
    logo: "/logos/kfc.png",
    bgColor: "bg-[#E4002B]"
  },
  {
    name: "Texas Chicken",
    logo: "/logos/texas-chicken.png",
    bgColor: "bg-white"
  },
  {
    name: "Burger King",
    logo: "/logos/burger-king.png",
    bgColor: "bg-[#FF8732]"
  },
  {
    name: "Shaurma 1",
    logo: "/logos/shaurma.png",
    bgColor: "bg-[#FF8732]"
  }
];

export default function PopularRestaurants() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Popular Restaurants Section */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Popular Restaurants</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularRestaurants.map((restaurant) => (
            <div
              key={restaurant.name}
              className="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className={`${restaurant.bgColor} p-6 flex items-center justify-center h-32`}>
                <img
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="h-16 object-contain"
                />
              </div>
              <div className="bg-red-500 text-white p-3 text-center">
                <p className="text-sm font-medium">{restaurant.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}