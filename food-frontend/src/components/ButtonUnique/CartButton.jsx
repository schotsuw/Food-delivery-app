import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

export const CartButton = ({ totalItems, totalPrice, handleCartToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-all duration-100 cursor-pointer"
      style={{
        background: isHovered ? "#15803D" : "#22C55E", // Darker green on hover
      }}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCart />
      </Badge>
      <span>${totalPrice.toFixed(2)}</span>
    </motion.button>
  );
};
