

const popularRestaurants = [
  {
    name: "McDonald's London",
    logo: "/logos/mcdonalds.png",
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

      {/* App Download Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gray-100">
        <div className="grid md:grid-cols-2 items-center">
          <div>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UizPn6GT56qh0Nm8A2aGMxkkvSP54x.png"
              alt="People using Order.uk app"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Order<span className="text-red-500">.uk</span>ing is more
            </h2>
            <div className="bg-navy inline-block rounded-full px-6 py-2 mb-6">
              <p className="text-xl md:text-2xl">
                <span className="text-red-500">Personalised</span>
                <span className="text-white"> & Instant</span>
              </p>
            </div>
            <p className="text-gray-600 mb-8">
              Download the Order.uk app for faster ordering
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img
                  src="/app-store.png"
                  alt="Download on the App Store"
                  className="h-10"
                />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img
                  src="/google-play.png"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}