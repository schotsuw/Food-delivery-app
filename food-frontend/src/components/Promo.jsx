import { useState, useEffect } from "react";
import { LocationOn } from "@mui/icons-material";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, CircularProgress } from "@mui/material";

const Promo = () => {
  const [location, setLocation] = useState("Regent Street, E12 345, Fredericton"); // Default location
  const [openDialog, setOpenDialog] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleOpenDialog = () => {
    setNewLocation(location); // Prefill current location
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLocation = () => {
    setLocation(newLocation);
    localStorage.setItem("userLocation", newLocation); // Save new location
    setOpenDialog(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true); // Show loading state
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
  
            // Extract Address Components
            let userLocation = "Unknown Location";
            if (data.address) {
              const { house_number, road, postcode, state, country } = data.address;
  
              userLocation = `${house_number || ""} ${road || ""}, ${postcode || ""}, ${state || ""}, ${country || ""}`
                .replace(/\s+/g, " ") // Remove extra spaces
                .trim();
            }
  
            setLocation(userLocation);
            localStorage.setItem("userLocation", userLocation);
            setNewLocation(userLocation);
          } catch (error) {
            setLocation("Location not found");
          } finally {
            setLoading(false);
            setOpenDialog(false);
          }
        },
        () => {
          setLoading(false);
          alert("Failed to get your current location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  

  return (
    <>
      <div className="bg-white py-2 px-4 flex justify-between items-center text-sm border-b">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">✨</span>
          <span>Get 5% Off your first order, <span className="text-red-500">Promo: ORDER5</span></span>
        </div>
        <div className="flex items-center gap-2">
          <LocationOn className="text-gray-600" />
          <span>{location}</span>
          <Button color="primary" size="small" onClick={handleOpenDialog}>
            <span className="underline">Change Location</span>
          </Button>
        </div>
      </div>

      {/* Change Location Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Change Location</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Enter a new location or use your current location.
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Enter Address"
            variant="outlined"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleUseCurrentLocation} 
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Use My Current Location"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmLocation} variant="contained" color="primary" disabled={!newLocation}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Promo;
