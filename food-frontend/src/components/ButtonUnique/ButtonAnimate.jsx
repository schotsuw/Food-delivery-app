import { motion } from "framer-motion";
import { useState } from "react";

export const ButtonAnimate = ({ children, startIcon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        background: isHovered
          ? "linear-gradient(to top, #4F46E5, #0EA5E9)" // Indigo → Sky (Hover)
          : "linear-gradient(to top, #0EA5E9, #4F46E5)", // Sky → Indigo (Default)

      }}
      transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold transition-all duration-100 border-2 cursor-pointer"
      style={{
        background: isHovered
          ? "linear-gradient(to top, #4F46E5, #0EA5E9)" // Indigo → Sky (Hover)
          : "linear-gradient(to top, #0EA5E9, #4F46E5)", // Sky → Indigo (Default)
      }}
    >
      {startIcon && <span>{startIcon}</span>}
      {children}
    </motion.button>
  );
};
