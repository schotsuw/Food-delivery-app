// src/components/MenuItem.jsx
import React from 'react';
import {
    CardContent,
    Typography,
    Button,
    IconButton,
    Box,
    Chip,
    Snackbar
} from '@mui/material';
import {
    Add,
    Favorite,
    FavoriteBorder,
    LocalFireDepartment as HotIcon,
    SentimentVerySatisfied as PopularIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, isFavorite, restaurant, onToggleFavorite }) => {
    // Use cart context
    const { addToCart } = useCart();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    // Add a ref to track if we've just added the item
    const addedRef = React.useRef(false);

    // Determine if item should show special indicators
    const isSpicy = item.isSpicy || item.name.toLowerCase().includes('spicy');
    const isPopular = item.isPopular || (item.rating && item.rating > 4.5);

    const handleAddToCart = React.useCallback((e) => {
        // Stop event propagation
        if (e) e.stopPropagation();

        // Prevent double execution
        if (addedRef.current) return;

        // Ensure there's a valid restaurant name before adding to cart
        const restaurantName = item.restaurantName || restaurant?.name;
        if (!restaurantName) {
            console.error("Cannot add item to cart: No restaurant name available");
            return;
        }

        addedRef.current = true;
        setTimeout(() => {
            addedRef.current = false;
        }, 500); // Reset after 500ms

        console.log('Adding to cart:', item.name);

        // Make sure restaurant info is included
        const cartItem = {
            ...item,
            restaurantName: restaurantName // Use the validated restaurant name
        };
        addToCart(cartItem);
        setSnackbarOpen(true);
    }, [item, restaurant, addToCart]);

    // Handler for closing snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                }}
            >
                <motion.div
                    className="h-full flex flex-col rounded-xl overflow-hidden shadow-md bg-white"
                    whileHover={{
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Item Image */}
                    {item.imageUrl && (
                        <Box className="relative">
                            <motion.img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-40 w-full object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Favorite button */}
                            <motion.div
                                className="absolute top-2 left-1 right-1"
                                whileTap={{ scale: 0.9 }}
                            >
                                <IconButton
                                    className="bg-white/70 hover:bg-white"
                                    size="small"
                                    onClick={() => onToggleFavorite(item.id)}
                                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {isFavorite ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                        >
                                            <Favorite fontSize="small" color="error" />
                                        </motion.div>
                                    ) : (
                                        <FavoriteBorder fontSize="small" />
                                    )}
                                </IconButton>
                            </motion.div>

                            {/* Special indicators */}
                            <Box className="absolute bottom-2 left-2 flex gap-1">
                                {isSpicy && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Chip
                                            icon={<HotIcon fontSize="small" />}
                                            label="Spicy"
                                            size="small"
                                            className="bg-red-500 text-white"
                                        />
                                    </motion.div>
                                )}
                                {isPopular && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Chip
                                            icon={<PopularIcon fontSize="small" />}
                                            label="Popular"
                                            size="small"
                                            className="bg-amber-500 text-white"
                                        />
                                    </motion.div>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Item Content */}
                    <CardContent className="flex-grow flex flex-col">
                        <Typography gutterBottom variant="h6" component="div" className="font-semibold">
                            {item.name}
                        </Typography>

                        {item.description && (
                            <Typography variant="body2" color="text.secondary" className="mb-3 flex-grow">
                                {item.description}
                            </Typography>
                        )}

                        {/* Item customization tags if available */}
                        {item.customizationOptions && item.customizationOptions.length > 0 && (
                            <Box className="flex flex-wrap gap-1 mb-3">
                                {item.customizationOptions.map((option, index) => (
                                    <Chip
                                        key={index}
                                        label={option}
                                        size="small"
                                        variant="outlined"
                                        className="text-xs"
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Price and Add button */}
                        <Box className="flex justify-between items-center mt-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Typography variant="h6" color="primary" className="font-bold">
                                    ${item.price.toFixed(2)}
                                </Typography>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={handleAddToCart}
                                    className="rounded-full"
                                >
                                    Add
                                </Button>
                            </motion.div>
                        </Box>
                    </CardContent>
                </motion.div>
            </motion.div>

            {/* Snackbar notification */}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message={`Added ${item.name} to cart`}
            />
        </>
    );
};

export default MenuItem;