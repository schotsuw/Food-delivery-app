// src/components/RestaurantMenu.jsx
import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Button,
    Divider,
    FormControl,
    Select,
    MenuItem as MuiMenuItem,
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import {
    Search,
    FilterList,
    Sort as SortIcon,
    Favorite as FavoriteIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from './MenuItem';
import MenuCategories from './MenuCategories';
import { useCart } from '../context/CartContext';

// TabPanel component for the category tabs
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`menu-tabpanel-${index}`}
            aria-labelledby={`menu-tab-${index}`}
            {...other}
        >
            {value === index && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box sx={{ py: 3 }}>
                            {children}
                        </Box>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}

const RestaurantMenu = ({ menuItems, restaurant }) => {
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [itemCounts, setItemCounts] = useState({});
    const [sortOption, setSortOption] = useState('recommended');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Extract unique categories from menu items
    const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Uncategorized'))];

    // Calculate item counts by category
    useEffect(() => {
        const counts = {};
        menuItems.forEach(item => {
            const category = item.category || 'Uncategorized';
            counts[category] = (counts[category] || 0) + 1;
        });
        setItemCounts(counts);
    }, [menuItems]);

    useEffect(() => {
        // Load favorites from localStorage if available
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage when they change
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle search
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Toggle favorite status
    const toggleFavorite = (itemId) => {
        if (favorites.includes(itemId)) {
            setFavorites(favorites.filter(id => id !== itemId));
        } else {
            setFavorites([...favorites, itemId]);
        }
    };

    // Handle sort change
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    // Toggle favorites filter
    const toggleFavoritesFilter = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    // Filter menu items based on search, category, and favorites
    let filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = tabValue === 0 || item.category === categories[tabValue] ||
            (!item.category && categories[tabValue] === 'Uncategorized');
        const matchesFavorites = !showFavoritesOnly || favorites.includes(item.id);

        return matchesSearch && matchesCategory && matchesFavorites;
    });

    // Sort filtered items
    if (sortOption === 'priceAsc') {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
        filteredItems.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'nameAsc') {
        filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'popular') {
        // Sort by popularity (assuming items have a popularity or rating property)
        filteredItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // For 'recommended' we don't need to sort as it's the default order

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <Typography variant="h4" component="h2" className="font-bold">
                            Our Menu
                        </Typography>
                    </motion.div>

                    <Box className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <TextField
                                placeholder="Search menu items..."
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full sm:w-56 md:w-64"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <Box className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Tooltip title="Show only favorites">
                                    <IconButton
                                        color={showFavoritesOnly ? "primary" : "default"}
                                        onClick={toggleFavoritesFilter}
                                        size="small"
                                        className="border border-gray-300"
                                    >
                                        <FavoriteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            >
                                <FormControl size="small" className="w-40">
                                    <Select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Sort by' }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SortIcon fontSize="small" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MuiMenuItem value="recommended">Recommended</MuiMenuItem>
                                        <MuiMenuItem value="popular">Most Popular</MuiMenuItem>
                                        <MuiMenuItem value="priceAsc">Price: Low to High</MuiMenuItem>
                                        <MuiMenuItem value="priceDesc">Price: High to Low</MuiMenuItem>
                                        <MuiMenuItem value="nameAsc">Name: A to Z</MuiMenuItem>
                                    </Select>
                                </FormControl>
                            </motion.div>
                        </Box>
                    </Box>
                </Box>

                <motion.div
                    className="mb-2 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                        <InfoIcon fontSize="small" />
                        Click on item images for more details. Favorites are saved for your current session.
                    </Typography>
                </motion.div>
            </motion.div>

            {/* Category Tabs */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <MenuCategories
                    categories={categories}
                    selectedCategory={tabValue}
                    onCategoryChange={handleTabChange}
                    itemCounts={itemCounts}
                />
            </motion.div>

            {/* Menu Items */}
            {categories.map((category, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                    {filteredItems.length === 0 ? (
                        <motion.div
                            className="text-center py-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Typography variant="h6" className="text-gray-500 mb-2">
                                No menu items found
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                Try a different search term, category, or clear filters
                            </Typography>
                            {(searchQuery || showFavoritesOnly) && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="outlined"
                                        className="mt-4"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowFavoritesOnly(false);
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Grid container spacing={3}>
                                {filteredItems.map((item, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: idx * 0.05 // Stagger the items
                                            }}
                                        >
                                            <MenuItem
                                                item={item}
                                                isFavorite={favorites.includes(item.id)}
                                                onToggleFavorite={toggleFavorite}
                                                restaurant={restaurant}
                                            />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    )}
                </TabPanel>
            ))}

            {/* Dietary information section */}
            <motion.div
                className="mt-10 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Typography variant="h6" className="mb-2 font-semibold">
                    Dietary Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    We're committed to providing accurate information for customers with dietary restrictions.
                    Please note that our kitchen handles common allergens including nuts, gluten, dairy, eggs, and seafood.
                    Cross-contamination is possible despite our best efforts.
                </Typography>
                <Box className="flex flex-wrap gap-3 mt-4">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'].map((diet, index) => (
                        <motion.div
                            key={diet}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (index * 0.1) }}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <Chip
                                label={diet}
                                variant="outlined"
                                size="small"
                            />
                        </motion.div>
                    ))}
                </Box>
            </motion.div>
        </motion.div>
    );
};

export default RestaurantMenu;