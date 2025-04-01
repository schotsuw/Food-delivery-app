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
    Divider,
    Paper
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    DeliveryDining as DeliveryDiningIcon,
    LocalPhone as LocalPhoneIcon,
    LocationOn as LocationOnIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import RestaurantMenu from '../components/RestaurantMenu';

// Default logos mapping for fallback
const RESTAURANT_LOGOS = {
    "mcdonalds": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/2339px-McDonald%27s_Golden_Arches.svg.png",
    "wendys": "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Wendy%27s_full_logo_2012.svg/640px-Wendy%27s_full_logo_2012.svg.png",
    "burger king": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/2024px-Burger_King_logo_%281999%29.svg.png",
    // Add more as needed
};

// Brand colors mapping
const BRAND_COLORS = {
    "mcdonalds": { primary: '#DA291C', secondary: '#FFC72C', text: '#fff' },
    "wendys": { primary: '#C6002B', secondary: '#FFB81C', text: '#fff' },
    "burger king": { primary: '#D62300', secondary: '#F5EBDC', text: '#fff' },
    // Add more as needed
    "default": { primary: '#f44336', secondary: '#ffeb3b', text: '#fff' }
};

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

    // Helper function to get appropriate logo URL
    const getLogoUrl = (restaurant) => {
        // First priority: Use the imageUrl from the database if available
        if (restaurant.imageUrl) return restaurant.imageUrl;

        // Second priority: Use the logoUrl if available
        if (restaurant.logoUrl) return restaurant.logoUrl;

        // Third priority: Check if we have a default logo for this restaurant
        const restaurantName = restaurant.name.toLowerCase();

        // Find matching restaurant name in our logo mapping
        for (const [key, url] of Object.entries(RESTAURANT_LOGOS)) {
            if (restaurantName.includes(key)) {
                return url;
            }
        }

        // Return a generic placeholder if no match found
        return '/placeholder-logo.png';
    };

    // Helper function to get brand colors
    const getBrandColors = (restaurant) => {
        if (!restaurant || !restaurant.name) return BRAND_COLORS.default;

        const restaurantName = restaurant.name.toLowerCase();

        // Find matching restaurant name in our brand colors mapping
        for (const [key, colors] of Object.entries(BRAND_COLORS)) {
            if (restaurantName.includes(key)) {
                return colors;
            }
        }

        return BRAND_COLORS.default;
    };

    // Helper function to assign sample categories based on item name
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    if (loading) {
        return (
            <Box className="flex justify-center items-center h-64">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <CircularProgress />
                </motion.div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert severity="error">{error}</Alert>
                </motion.div>
            </Box>
        );
    }

    if (!restaurant) {
        return (
            <Box className="p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert severity="info">Restaurant not found!</Alert>
                </motion.div>
            </Box>
        );
    }

    // Get brand-specific colors
    const brandColors = getBrandColors(restaurant);
    const logoUrl = getLogoUrl(restaurant);

    return (
        <Container maxWidth="lg" className="py-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Restaurant Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    {/* Restaurant Banner */}
                    <Paper
                        elevation={3}
                        className="rounded-xl overflow-hidden mb-6"
                        component={motion.div}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Hero Area with Restaurant Name and Feature Background */}
                        <Box
                            className="relative"
                            sx={{
                                height: { xs: '160px', sm: '200px', md: '240px' },
                                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primary} 60%, ${brandColors.secondary} 200%)`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Background Pattern */}
                            <Box
                                className="absolute inset-0 opacity-10"
                                sx={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
                                    backgroundSize: '24px 24px'
                                }}
                            />

                            {/* Restaurant Information Overlay */}
                            <Box className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                                <Box className="flex items-start">
                                    {/* Logo Container */}
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: { xs: '80px', sm: '100px' },
                                            height: { xs: '80px', sm: '100px' }
                                        }}
                                    >
                                        <img
                                            src={logoUrl}
                                            alt={`${restaurant.name} logo`}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </Box>

                                    {/* Restaurant Name and Rating */}
                                    <Box
                                        className="ml-4"
                                        component={motion.div}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <Typography
                                            variant="h4"
                                            className="font-bold drop-shadow-lg"
                                            sx={{
                                                color: brandColors.text,
                                                fontSize: { xs: '1.75rem', sm: '2.25rem' }
                                            }}
                                        >
                                            {restaurant.name}
                                        </Typography>

                                        <Box className="flex items-center mt-1">
                                            <StarIcon sx={{ color: brandColors.secondary }} />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: brandColors.text,
                                                    ml: 0.5,
                                                    fontWeight: 500,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {restaurant.rating || '4.2'}
                                                <Typography
                                                    variant="body2"
                                                    component="span"
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        ml: 0.5,
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    ({restaurant.reviewCount || '153'} reviews)
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Popular Tags */}
                                <Box
                                    className="flex flex-wrap gap-2 mb-2 mt-auto"
                                    sx={{
                                        justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box className="flex flex-wrap gap-2">
                                        {['Great Food', 'Fast Delivery', 'Good Value'].map((tag, index) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                            >
                                                <Chip
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(255,255,255,0.85)',
                                                        color: brandColors.primary,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </Box>

                                    {/* Featured Tag */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <Chip
                                            label="Featured Restaurant"
                                            size="medium"
                                            sx={{
                                                backgroundColor: brandColors.secondary,
                                                color: brandColors.primary,
                                                fontWeight: 700,
                                                '&:hover': {
                                                    backgroundColor: brandColors.secondary,
                                                }
                                            }}
                                        />
                                    </motion.div>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Restaurant Info Cards */}
                    <Box
                        className="grid gap-4 mb-6"
                        sx={{
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
                        }}
                    >
                        {/* Details Card */}
                        <motion.div
                            component={Paper}
                            elevation={2}
                            className="p-4 rounded-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
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
                        </motion.div>

                        {/* Delivery Info Card */}
                        <motion.div
                            component={Paper}
                            elevation={2}
                            className="p-4 rounded-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Typography variant="h6" className="font-semibold mb-3">Delivery</Typography>
                            <Box className="flex items-start gap-2 mb-2">
                                <DeliveryDiningIcon fontSize="small" className="text-gray-500 mt-0.5" />
                                <Typography variant="body2">
                                    {restaurant.deliveryTime ? `${restaurant.deliveryTime} minutes` : 'Delivery time not available'}
                                </Typography>
                            </Box>
                            <Box className="mt-2">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Chip
                                        label="Free delivery on orders over $15"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </motion.div>
                            </Box>
                        </motion.div>

                        {/* Ratings Card */}
                        <motion.div
                            component={Paper}
                            elevation={2}
                            className="p-4 rounded-lg"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Typography variant="h6" className="font-semibold mb-3">Ratings</Typography>
                            <Box className="flex items-center gap-1 mb-2">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, 0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 1,
                                        repeat: 0
                                    }}
                                >
                                    <StarIcon fontSize="small" className="text-yellow-500" />
                                </motion.div>
                                <Typography variant="body1" className="font-bold">
                                    {restaurant.rating || '4.2'}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    ({restaurant.reviewCount || '153'} reviews)
                                </Typography>
                            </Box>
                            <Box className="flex flex-wrap gap-1 mt-2">
                                {['Great Food', 'Fast Delivery', 'Good Value'].map((label, index) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + (index * 0.2) }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Chip
                                            label={label}
                                            size="small"
                                            className="bg-gray-200"
                                        />
                                    </motion.div>
                                ))}
                            </Box>
                        </motion.div>
                    </Box>

                    {/* About Section */}
                    <motion.div
                        component={Paper}
                        elevation={2}
                        className="p-4 rounded-lg mb-6"
                        variants={itemVariants}
                    >
                        <Typography variant="h6" className="font-semibold mb-2">About</Typography>
                        <Typography variant="body2" className="text-gray-700">
                            {restaurant.description ||
                                'Welcome to our restaurant! We serve delicious food made with the freshest ingredients. Our chefs prepare each dish with care and attention to detail, ensuring a memorable dining experience for all our customers.'}
                        </Typography>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Divider className="my-6" />
                    </motion.div>
                </motion.div>

                {/* Menu Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <RestaurantMenu
                        menuItems={menuItems}
                        onAddToCart={handleAddToCart}
                        restaurant={restaurant}
                    />
                </motion.div>
            </motion.div>
        </Container>
    );
};

export default SingleRestaurantPage;