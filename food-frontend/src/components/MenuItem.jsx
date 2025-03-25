// src/components/MenuItem.jsx
import React from 'react';
import {
    Card,
    CardMedia,
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
import { useCart } from '../context/CartContext';

const MenuItem = ({ item, isFavorite, onToggleFavorite }) => {
    // Use cart context
    const { addToCart } = useCart();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    // Determine if item should show special indicators
    const isSpicy = item.isSpicy || item.name.toLowerCase().includes('spicy');
    const isPopular = item.isPopular || (item.rating && item.rating > 4.5);

    // Handler for add to cart
    const handleAddToCart = () => {
        addToCart(item);
        setSnackbarOpen(true);
    };

    // Handler for closing snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                {/* Item Image */}
                {item.imageUrl && (
                    <Box className="relative">
                        <CardMedia
                            component="img"
                            height="160"
                            image={item.imageUrl}
                            alt={item.name}
                            className="h-40 object-cover"
                        />

                        {/* Favorite button */}
                        <IconButton
                            className="absolute top-2 right-2 bg-white/70 hover:bg-white"
                            size="small"
                            onClick={() => onToggleFavorite(item.id)}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ?
                                <Favorite fontSize="small" color="error" /> :
                                <FavoriteBorder fontSize="small" />}
                        </IconButton>

                        {/* Special indicators */}
                        <Box className="absolute bottom-2 left-2 flex gap-1">
                            {isSpicy && (
                                <Chip
                                    icon={<HotIcon fontSize="small" />}
                                    label="Spicy"
                                    size="small"
                                    className="bg-red-500 text-white"
                                />
                            )}
                            {isPopular && (
                                <Chip
                                    icon={<PopularIcon fontSize="small" />}
                                    label="Popular"
                                    size="small"
                                    className="bg-amber-500 text-white"
                                />
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
                        <Typography variant="h6" color="primary" className="font-bold">
                            ${item.price.toFixed(2)}
                        </Typography>

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
                    </Box>
                </CardContent>
            </Card>

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