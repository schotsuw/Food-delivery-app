// src/pages/SingleRestaurantPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '../services/api';
import {
    CircularProgress,
    Alert,
    Typography,
    Box,
    Chip,
    Container,
    Divider
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    DeliveryDining as DeliveryDiningIcon,
    LocalPhone as LocalPhoneIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon
} from '@mui/icons-material';
import RestaurantMenu from '../components/RestaurantMenu';

const SingleRestaurantPage = () => {
    const { restaurantSlug } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                setLoading(true);
                // Fetch restaurant data
                const restaurantResponse = await restaurantApi.getRestaurantById(restaurantSlug);
                setRestaurant(restaurantResponse.data);

                // Fetch menu items for this restaurant
                const menuResponse = await restaurantApi.getMenuByRestaurant(restaurantResponse.data.id);

                // Add category to menu items if it doesn't exist
                // This is just for demo purposes - your actual API might already include categories
                const categorizedMenuItems = menuResponse.data.map(item => ({
                    ...item,
                    category: item.category || getCategoryByName(item.name)
                }));

                setMenuItems(categorizedMenuItems);
                setError(null);
            } catch (err) {
                console.error('Error fetching restaurant details:', err);
                setError('Failed to load restaurant details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantSlug]);

    // Helper function to assign sample categories based on item name
    // This is for demo purposes - in a real app, categories would come from your backend
    const getCategoryByName = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('burger') || nameLower.includes('sandwich')) return 'Burgers & Sandwiches';
        if (nameLower.includes('pizza')) return 'Pizza';
        if (nameLower.includes('salad')) return 'Salads';
        if (nameLower.includes('fries') || nameLower.includes('wings') || nameLower.includes('onion rings')) return 'Sides';
        if (nameLower.includes('cake') || nameLower.includes('ice') || nameLower.includes('cookie')) return 'Desserts';
        if (nameLower.includes('soda') || nameLower.includes('water') || nameLower.includes('juice')) return 'Beverages';
        return 'Popular Items';
    };

    const handleAddToCart = (item) => {
        // Check if item already exists in cart
        const itemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (itemIndex >= 0) {
            // Item exists, increase quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[itemIndex].quantity += 1;
            setCartItems(updatedCartItems);
        } else {
            // Item doesn't exist, add to cart with quantity 1
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }

        // You could also trigger a notification here
        console.log(`Added ${item.name} to cart`);
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-4">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!restaurant) {
        return (
            <Box className="p-4">
                <Alert severity="info">Restaurant not found!</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className="py-6">
            {/* Restaurant Header */}
            <Box className="mb-8">
                <Typography variant="h3" component="h1" className="font-bold mb-2">
                    {restaurant.name}
                </Typography>

                {/* Restaurant Image */}
                <Box className="w-full h-64 rounded-xl overflow-hidden mb-6">
                    <img
                        src={restaurant.imageUrl || '/placeholder-restaurant.jpg'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                </Box>

                {/* Restaurant Info Cards */}
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Details Card */}
                    <Box className="bg-gray-50 p-4 rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-3">Details</Typography>
                        <Box className="flex items-start gap-2 mb-2">
                            <LocationOnIcon fontSize="small" className="text-gray-500 mt-0.5" />
                            <Typography variant="body2">
                                {restaurant.location || 'Location not available'}
                            </Typography>
                        </Box>
                        {restaurant.phone && (
                            <Box className="flex items-start gap-2 mb-2">
                                <LocalPhoneIcon fontSize="small" className="text-gray-500 mt-0.5" />
                                <Typography variant="body2">{restaurant.phone}</Typography>
                            </Box>
                        )}
                        <Box className="flex items-start gap-2">
                            <AccessTimeIcon fontSize="small" className="text-gray-500 mt-0.5" />
                            <Typography variant="body2">
                                {restaurant.hours || 'Hours not available'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Delivery Info Card */}
                    <Box className="bg-gray-50 p-4 rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-3">Delivery</Typography>
                        <Box className="flex items-start gap-2 mb-2">
                            <DeliveryDiningIcon fontSize="small" className="text-gray-500 mt-0.5" />
                            <Typography variant="body2">
                                {restaurant.deliveryTime ? `${restaurant.deliveryTime} minutes` : 'Delivery time not available'}
                            </Typography>
                        </Box>
                        <Box className="mt-2">
                            <Chip
                                label="Free delivery on orders over $15"
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    {/* Ratings Card */}
                    <Box className="bg-gray-50 p-4 rounded-lg">
                        <Typography variant="h6" className="font-semibold mb-3">Ratings</Typography>
                        <Box className="flex items-center gap-1 mb-2">
                            <StarIcon fontSize="small" className="text-yellow-500" />
                            <Typography variant="body1" className="font-bold">
                                {restaurant.rating || '4.2'}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                (153 reviews)
                            </Typography>
                        </Box>
                        <Box className="flex flex-wrap gap-1 mt-2">
                            <Chip
                                label="Great Food"
                                size="small"
                                className="bg-gray-200"
                            />
                            <Chip
                                label="Fast Delivery"
                                size="small"
                                className="bg-gray-200"
                            />
                            <Chip
                                label="Good Value"
                                size="small"
                                className="bg-gray-200"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* About Section */}
                <Box className="mb-6">
                    <Typography variant="h6" className="font-semibold mb-2">About</Typography>
                    <Typography variant="body2" className="text-gray-700">
                        {restaurant.description ||
                            'Welcome to our restaurant! We serve delicious food made with the freshest ingredients. Our chefs prepare each dish with care and attention to detail, ensuring a memorable dining experience for all our customers.'}
                    </Typography>
                </Box>

                <Divider className="my-6" />
            </Box>

            {/* Menu Section */}
            <RestaurantMenu
                menuItems={menuItems}
                onAddToCart={handleAddToCart}
                restaurant={restaurant}  // Add this line
            />
        </Container>
    );
};

export default SingleRestaurantPage;