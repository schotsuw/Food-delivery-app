import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, Chip, Tabs, Tab } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import heroOffer from "../assets/heroOffer.png";

const categories = ['Vegan', 'Sushi', 'Pizza & Fast food', 'others'];

const offers = [
  { id: 1, name: "McDonald's", deal: "20% Off Big Mac Meals", image: "/assets/mcdonalds.jpg", type: "meal-deals" },
  { id: 2, name: "Domino's Pizza", deal: "Buy 1 Get 1 Free", image: "/assets/dominos.jpg", type: "bogo" },
  { id: 3, name: "Subway", deal: "Free Drink with Any Sub", image: "/assets/subway.jpg", type: "freebies" },
  { id: 4, name: "KFC", deal: "15% Off Chicken Buckets", image: "/kfc.png", type: "meal-deals" },
];

const popularCategories = [
  { name: 'Burgers & Fast food', restaurants: 21 },
  { name: 'Salads', restaurants: 32 },
  { name: 'Pasta & Casuals', restaurants: 4 },
  { name: 'Pizza', restaurants: 32 },
  { name: 'Breakfast', restaurants: 4 },
  { name: 'Soups', restaurants: 32 }
];

const SpecialOfferPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dealsRef = useRef(null); // ✅ Create a ref for the deals section

  // 🔹 Function to scroll to deals section
  const scrollToDeals = () => {
    if (dealsRef.current) {
      dealsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredOffers =
    selectedCategory === "all"
      ? offers
      : offers.filter((offer) => offer.type === selectedCategory);

  return (
    <Box className="container mx-auto px-4 py-8">
      {/* 🔥 Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative rounded-lg overflow-hidden"
      >
        <img src={heroOffer} alt="Special Offers" className="w-full h-64 object-cover rounded-lg shadow-lg" />
        <Box className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500 to-pink-500 bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
          <Typography variant="h3" className="text-white font-bold">
            Exclusive Deals for You! 🎉
          </Typography>
          <Typography variant="h6" className="text-gray-200 mt-2">
            Save big on your favorite meals. Limited-time offers only!
          </Typography>

          {/* 🔽 Browse Deals Button (Scrolls to Deals Section) */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={scrollToDeals}>
              Browse Deals
            </Button>
          </motion.div>
        </Box>
      </motion.div>
      {/* 🔹 Offer Categories */}
      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        centered
        sx={{ my: 4 }}
      >
        <Tab label="All" value="all" icon={<LocalOfferIcon />} />
        <Tab label="Meal Deals" value="meal-deals" icon={<RestaurantIcon />} />
        <Tab label="Buy 1 Get 1" value="bogo" icon={<LocalOfferIcon />} />
        <Tab label="Freebies" value="freebies" icon={<RestaurantIcon />} />
      </Tabs>

      {/* 🏷 Special Offers Grid (Ref added here) */}
      <Box ref={dealsRef} sx={{ mt: 2 }}> 
        <Grid container spacing={4}>
          {filteredOffers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="shadow-md rounded-lg overflow-hidden">
                  <CardMedia component="img" height="200" image={offer.image} alt={offer.name} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {offer.name}
                    </Typography>
                    <Chip label={offer.deal} color="primary" className="my-2" />
                    <Box className="mt-3">
                      <Button variant="contained" color="primary" fullWidth>
                        Order Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Popular Categories Section */}
      {/* Popular Categories Section */}
<Box sx={{ mt: 10 }}>
  <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
    FoodFetch Popular Categories 😋
  </Typography>

  <Grid container spacing={4}>
    {popularCategories.map((category) => (
      <Grid item xs={6} sm={4} md={2} key={category.name}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="shadow-md rounded-xl overflow-hidden">
            <CardMedia
              component="img"
              height="140"
              image={`/images/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} // Adjust path based on actual image storage
              alt={category.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.restaurants} Restaurants
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    ))}
  </Grid>
</Box>

    </Box>
  );
};

export default SpecialOfferPage;
