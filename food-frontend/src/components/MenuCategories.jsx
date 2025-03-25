// src/components/MenuCategories.jsx
import React from 'react';
import {
    Tabs,
    Tab,
    Box,
    Badge,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    LocalBar as DrinksIcon,
    Cake as DessertIcon,
    Fastfood as BurgerIcon,
    LocalPizza as PizzaIcon,
    Restaurant as MainsIcon,
    EggAlt as SidesIcon,
    SetMeal as PopularIcon
} from '@mui/icons-material';

// Map of category names to their respective icons
const CATEGORY_ICONS = {
    'All': <PopularIcon />,
    'Popular Items': <PopularIcon />,
    'Burgers & Sandwiches': <BurgerIcon />,
    'Pizza': <PizzaIcon />,
    'Mains': <MainsIcon />,
    'Sides': <SidesIcon />,
    'Desserts': <DessertIcon />,
    'Beverages': <DrinksIcon />
};

const MenuCategories = ({ categories, selectedCategory, onCategoryChange, itemCounts }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
                value={selectedCategory}
                onChange={onCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="menu categories"
                allowScrollButtonsMobile
                sx={{
                    '& .MuiTab-root': {
                        minWidth: '120px', // Set minimum width for each tab
                        px: 3, // Add horizontal padding
                        mx: 0.5, // Add margin between tabs
                    },
                    '& .MuiTabs-flexContainer': {
                        gap: { xs: 1, sm: 2 } // Add gap between tabs that's responsive
                    }
                }}
            >
                {categories.map((category, index) => (
                    <Tab
                        key={index}
                        label={
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', // Center content
                                width: '100%' // Take full width of the tab
                            }}>
                                {/* Add the icon if it exists in our mapping */}
                                {CATEGORY_ICONS[category] && (
                                    <Box sx={{
                                        mr: 1,
                                        display: { xs: 'none', sm: 'block' }
                                    }}>
                                        {CATEGORY_ICONS[category]}
                                    </Box>
                                )}

                                {/* If we have item counts and this isn't the 'All' category */}
                                {itemCounts && index !== 0 ? (
                                    <Badge
                                        badgeContent={itemCounts[category] || 0}
                                        color="primary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: -10,
                                                top: -3
                                            }
                                        }}
                                    >
                                        {category}
                                    </Badge>
                                ) : (
                                    category
                                )}
                            </Box>
                        }
                        id={`menu-tab-${index}`}
                        aria-controls={`menu-tabpanel-${index}`}
                        iconPosition={isMobile ? "top" : "start"}
                        // Remove custom text styling to inherit from theme
                        sx={{
                            // Maintain spacing while removing custom text styles
                            fontFamily: 'inherit', // Use the theme's font family
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default MenuCategories;