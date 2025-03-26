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
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
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

    return (
        <div className="mb-8">
            <div className="mb-6">
                <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Typography variant="h4" component="h2" className="font-bold">
                        Our Menu
                    </Typography>

                    <Box className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
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

                        <Box className="flex items-center gap-2">
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
                        </Box>
                    </Box>
                </Box>

                <Box className="mb-2 flex items-center">
                    <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                        <InfoIcon fontSize="small" />
                        Click on item images for more details. Favorites are saved for your current session.
                    </Typography>
                </Box>
            </div>

            {/* Category Tabs */}
            <MenuCategories
                categories={categories}
                selectedCategory={tabValue}
                onCategoryChange={handleTabChange}
                itemCounts={itemCounts}
            />

            {/* Menu Items */}
            {categories.map((category, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                    {filteredItems.length === 0 ? (
                        <Box className="text-center py-10">
                            <Typography variant="h6" className="text-gray-500 mb-2">
                                No menu items found
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                Try a different search term, category, or clear filters
                            </Typography>
                            {(searchQuery || showFavoritesOnly) && (
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
                            )}
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredItems.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <MenuItem
                                        item={item}
                                        isFavorite={favorites.includes(item.id)}
                                        onToggleFavorite={toggleFavorite}
                                        restaurant={restaurant}  // Add this line
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </TabPanel>
            ))}

            {/* Dietary information section */}
            <Box className="mt-10 pt-6 border-t border-gray-200">
                <Typography variant="h6" className="mb-2 font-semibold">
                    Dietary Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    We're committed to providing accurate information for customers with dietary restrictions.
                    Please note that our kitchen handles common allergens including nuts, gluten, dairy, eggs, and seafood.
                    Cross-contamination is possible despite our best efforts.
                </Typography>
                <Box className="flex flex-wrap gap-3 mt-4">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'].map((diet) => (
                        <Chip key={diet} label={diet} variant="outlined" size="small" />
                    ))}
                </Box>
            </Box>
        </div>
    );
};

export default RestaurantMenu;