// src/services/mockApi.js

// Mock restaurant data
const restaurantsData = [
    {
        id: 1,
        name: "Burger Heaven",
        description: "The best burgers in town, made with fresh ingredients and served with our special sauce.",
        location: "123 Main St, Anytown",
        hours: "Mon-Sun: 11:00 AM - 10:00 PM",
        phone: "(555) 123-4567",
        rating: 4.7,
        deliveryTime: 25,
        imageUrl: "https://source.unsplash.com/random/800x600/?burger-restaurant"
    },
    {
        id: 2,
        name: "Pizza Palace",
        description: "Authentic wood-fired pizzas with the freshest toppings. Family owned since 1982.",
        location: "456 Oak Ave, Anytown",
        hours: "Tue-Sun: 12:00 PM - 11:00 PM",
        phone: "(555) 765-4321",
        rating: 4.5,
        deliveryTime: 35,
        imageUrl: "https://source.unsplash.com/random/800x600/?pizza-restaurant"
    },
    {
        id: 3,
        name: "Sushi Sensation",
        description: "Fresh sushi and Japanese cuisine prepared by master chefs.",
        location: "789 Pine St, Anytown",
        hours: "Mon-Sat: 11:30 AM - 10:30 PM",
        phone: "(555) 987-6543",
        rating: 4.8,
        deliveryTime: 40,
        imageUrl: "https://source.unsplash.com/random/800x600/?sushi-restaurant"
    }
];

// Mock menu data
const menuItemsData = {
    1: [
        {
            id: 101,
            name: "Classic Burger",
            description: "1/3 lb beef patty with lettuce, tomato, onion, and our special sauce on a toasted brioche bun.",
            price: 8.99,
            category: "Burgers & Sandwiches",
            imageUrl: "https://source.unsplash.com/random/300x200/?burger",
            rating: 4.6,
            customizationOptions: ["Add cheese", "Add bacon", "Extra patty"]
        },
        {
            id: 102,
            name: "Cheese Burger",
            description: "1/3 lb beef patty with American cheese, lettuce, tomato, onion, and our special sauce.",
            price: 9.99,
            category: "Burgers & Sandwiches",
            imageUrl: "https://source.unsplash.com/random/300x200/?cheeseburger",
            rating: 4.7
        },
        {
            id: 103,
            name: "Bacon Burger",
            description: "1/3 lb beef patty with crispy bacon, American cheese, lettuce, tomato, and onion.",
            price: 10.99,
            category: "Burgers & Sandwiches",
            imageUrl: "https://source.unsplash.com/random/300x200/?bacon-burger",
            rating: 4.8
        },
        {
            id: 104,
            name: "Veggie Burger",
            description: "House-made veggie patty with lettuce, tomato, onion, and vegan mayo.",
            price: 9.99,
            category: "Burgers & Sandwiches",
            imageUrl: "https://source.unsplash.com/random/300x200/?veggie-burger",
            rating: 4.5,
            isPopular: true
        },
        {
            id: 105,
            name: "French Fries",
            description: "Crispy golden fries seasoned with our special spice blend.",
            price: 3.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?french-fries",
            rating: 4.4
        },
        {
            id: 106,
            name: "Onion Rings",
            description: "Thick-cut onion rings with a crispy beer batter.",
            price: 4.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?onion-rings",
            rating: 4.3
        },
        {
            id: 107,
            name: "Chocolate Milkshake",
            description: "Creamy chocolate milkshake made with premium ice cream.",
            price: 5.99,
            category: "Beverages",
            imageUrl: "https://source.unsplash.com/random/300x200/?chocolate-milkshake",
            rating: 4.9,
            isPopular: true
        },
        {
            id: 108,
            name: "Vanilla Milkshake",
            description: "Creamy vanilla milkshake made with premium ice cream.",
            price: 5.99,
            category: "Beverages",
            imageUrl: "https://source.unsplash.com/random/300x200/?vanilla-milkshake",
            rating: 4.7
        },
        {
            id: 109,
            name: "Strawberry Milkshake",
            description: "Creamy strawberry milkshake made with premium ice cream and real strawberries.",
            price: 5.99,
            category: "Beverages",
            imageUrl: "https://source.unsplash.com/random/300x200/?strawberry-milkshake",
            rating: 4.6
        },
        {
            id: 110,
            name: "Chocolate Chip Cookie",
            description: "Freshly baked chocolate chip cookie.",
            price: 1.99,
            category: "Desserts",
            imageUrl: "https://source.unsplash.com/random/300x200/?chocolate-chip-cookie",
            rating: 4.5
        }
    ],
    2: [
        {
            id: 201,
            name: "Margherita Pizza",
            description: "Fresh mozzarella, tomato sauce, and basil on our signature crust.",
            price: 12.99,
            category: "Pizza",
            imageUrl: "https://source.unsplash.com/random/300x200/?margherita-pizza",
            rating: 4.7,
            isPopular: true
        },
        {
            id: 202,
            name: "Pepperoni Pizza",
            description: "Pepperoni, mozzarella, and tomato sauce on our signature crust.",
            price: 14.99,
            category: "Pizza",
            imageUrl: "https://source.unsplash.com/random/300x200/?pepperoni-pizza",
            rating: 4.8,
            isPopular: true
        },
        {
            id: 203,
            name: "Supreme Pizza",
            description: "Pepperoni, sausage, bell peppers, onions, olives, and mushrooms.",
            price: 16.99,
            category: "Pizza",
            imageUrl: "https://source.unsplash.com/random/300x200/?supreme-pizza",
            rating: 4.6
        },
        {
            id: 204,
            name: "Veggie Pizza",
            description: "Bell peppers, onions, olives, mushrooms, and tomatoes.",
            price: 15.99,
            category: "Pizza",
            imageUrl: "https://source.unsplash.com/random/300x200/?veggie-pizza",
            rating: 4.5
        },
        {
            id: 205,
            name: "Buffalo Wings",
            description: "Crispy wings tossed in buffalo sauce. Served with ranch or blue cheese.",
            price: 9.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?buffalo-wings",
            rating: 4.4,
            isSpicy: true
        },
        {
            id: 206,
            name: "Garlic Knots",
            description: "Freshly baked garlic knots with marinara sauce.",
            price: 5.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?garlic-knots",
            rating: 4.6
        },
        {
            id: 207,
            name: "Caesar Salad",
            description: "Romaine lettuce, croutons, and parmesan cheese with Caesar dressing.",
            price: 7.99,
            category: "Salads",
            imageUrl: "https://source.unsplash.com/random/300x200/?caesar-salad",
            rating: 4.3
        },
        {
            id: 208,
            name: "House Salad",
            description: "Mixed greens, tomatoes, cucumbers, and onions with your choice of dressing.",
            price: 6.99,
            category: "Salads",
            imageUrl: "https://source.unsplash.com/random/300x200/?house-salad",
            rating: 4.2
        }
    ],
    3: [
        {
            id: 301,
            name: "California Roll",
            description: "Crab, avocado, and cucumber wrapped in seaweed and rice.",
            price: 8.99,
            category: "Sushi Rolls",
            imageUrl: "https://source.unsplash.com/random/300x200/?california-roll",
            rating: 4.5,
            isPopular: true
        },
        {
            id: 302,
            name: "Spicy Tuna Roll",
            description: "Spicy tuna and cucumber wrapped in seaweed and rice.",
            price: 9.99,
            category: "Sushi Rolls",
            imageUrl: "https://source.unsplash.com/random/300x200/?spicy-tuna-roll",
            rating: 4.7,
            isSpicy: true,
            isPopular: true
        },
        {
            id: 303,
            name: "Dragon Roll",
            description: "Eel, crab, and cucumber topped with avocado and eel sauce.",
            price: 12.99,
            category: "Sushi Rolls",
            imageUrl: "https://source.unsplash.com/random/300x200/?dragon-roll",
            rating: 4.8
        },
        {
            id: 304,
            name: "Rainbow Roll",
            description: "California roll topped with various sashimi.",
            price: 14.99,
            category: "Sushi Rolls",
            imageUrl: "https://source.unsplash.com/random/300x200/?rainbow-roll",
            rating: 4.6
        },
        {
            id: 305,
            name: "Salmon Nigiri",
            description: "Fresh salmon on a bed of rice.",
            price: 5.99,
            category: "Nigiri",
            imageUrl: "https://source.unsplash.com/random/300x200/?salmon-nigiri",
            rating: 4.7
        },
        {
            id: 306,
            name: "Tuna Nigiri",
            description: "Fresh tuna on a bed of rice.",
            price: 6.99,
            category: "Nigiri",
            imageUrl: "https://source.unsplash.com/random/300x200/?tuna-nigiri",
            rating: 4.8
        },
        {
            id: 307,
            name: "Miso Soup",
            description: "Traditional Japanese soup with tofu, seaweed, and green onions.",
            price: 3.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?miso-soup",
            rating: 4.5
        },
        {
            id: 308,
            name: "Edamame",
            description: "Steamed soybean pods with sea salt.",
            price: 4.99,
            category: "Sides",
            imageUrl: "https://source.unsplash.com/random/300x200/?edamame",
            rating: 4.4
        },
        {
            id: 309,
            name: "Green Tea",
            description: "Traditional Japanese green tea.",
            price: 2.99,
            category: "Beverages",
            imageUrl: "https://source.unsplash.com/random/300x200/?green-tea",
            rating: 4.3
        }
    ]
};

// Create mock API with artificial delay to simulate network request
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mockRestaurantApi = {
    // Get all restaurants
    getAllRestaurants: async () => {
        await delay(800); // Simulate network delay
        return { data: restaurantsData };
    },

    // Get restaurant by id or slug
    getRestaurantById: async (idOrSlug) => {
        await delay(500);

        // Support both numeric IDs and slug strings
        const id = parseInt(idOrSlug);
        const restaurant = isNaN(id)
            ? restaurantsData.find(r => r.name.toLowerCase().replace(/\s+/g, '-') === idOrSlug)
            : restaurantsData.find(r => r.id === id);

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        return { data: restaurant };
    },

    // Get menu items for a restaurant
    getMenuByRestaurant: async (restaurantId) => {
        await delay(700);

        const menuItems = menuItemsData[restaurantId];

        if (!menuItems) {
            throw new Error('Menu not found for this restaurant');
        }

        return { data: menuItems };
    }
};