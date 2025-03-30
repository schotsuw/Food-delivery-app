import { motion } from "framer-motion";
import { useState } from "react";
import { Badge, useMediaQuery, useTheme } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

export const CartButton = ({ totalItems, totalPrice, handleCartToggle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCartToggle}
            animate={{
                background: isHovered ? "#15803D" : "#22C55E", // Darker green on hover, default green
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1 sm:gap-2 ${isSmallScreen ? 'px-2 py-1.5' : 'px-3 sm:px-4 py-1.5 sm:py-2'} rounded-full text-white font-semibold transition-all duration-100 cursor-pointer`}
            style={{
                background: isHovered ? "#15803D" : "#22C55E", // Darker green on hover
            }}
        >
            <Badge badgeContent={totalItems} color="error">
                <ShoppingCart fontSize={isSmallScreen ? "small" : "medium"} />
            </Badge>
            {!isSmallScreen && <span>${totalPrice.toFixed(2)}</span>}
        </motion.button>
    );
};