import { useState } from "react";
import { motion } from "framer-motion";
import { Button, TextField, Typography, CircularProgress } from "@mui/material";
import herofood from "../assets/herofood.png";

const Hero = () => {
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setError(""); // Reset error message
    if (!postcode.trim()) {
      setError("Please enter a valid postal code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Searching for restaurants in ${postcode}...`); // Simulated action
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
      {/* Left Section - Text Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8"
      >
        <p className="text-gray-600 mb-2">
          Order Restaurant food, takeaway, and groceries.
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Feast Your Senses,
          <br />
          <span className="text-red-500">Fast and Fresh</span>
        </h1>

        {/* Search Input & Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.8, duration: 0.5 }}
          className="max-w-md"
        >
          <p className="mb-4">Enter a postal code to see what we deliver</p>
          <div className="flex w-full gap-2">
            <TextField
              fullWidth
              placeholder="e.g. E12 345"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              variant="outlined"
              error={!!error}
              helperText={error}
              InputProps={{
                sx: {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  paddingLeft: 2,
                  height: 50,
                },
              }}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                className="!bg-red-500 !text-white !rounded-lg !px-6 !h-[50px]"
                sx={{ height: "50px", minWidth: "120px" }}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "SEARCH"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section - Image Animation */}
      <motion.div
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative"
      >
        <img 
          src={herofood}
          alt="People enjoying food"
          className="w-full rounded-lg"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
