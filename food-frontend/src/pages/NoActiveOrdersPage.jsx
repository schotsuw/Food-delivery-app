import { motion } from "framer-motion";
import { Typography, Paper, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const NoActiveOrdersPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <Paper sx={{ p: 4, textAlign: "center", maxWidth: 600, mx: "auto", mt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <LocalDiningIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>No Active Orders</Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have any active orders to track at the moment.
            Browse our restaurants and place an order to get started!
          </Typography>
        </Box>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => navigate("/restaurant")}
          >
            Browse Restaurants
          </Button>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default NoActiveOrdersPage;