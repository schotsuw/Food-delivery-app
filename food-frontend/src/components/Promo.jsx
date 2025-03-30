import { useState, useEffect } from "react";
import { LocationOn, Edit, ArrowDropDown, Place } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  IconButton,
  Box,
  Popper,
  Paper,
  ClickAwayListener,
  useTheme
} from "@mui/material";

const Promo = () => {
  const [location, setLocation] = useState("Regent Street, E12 345, Fredericton"); // Default location
  const [openDialog, setOpenDialog] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Load saved location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleOpenDialog = () => {
    setNewLocation(location); // Prefill current location
    setOpenDialog(true);
    setAnchorEl(null); // Close popper if open
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

  const toggleLocationPopper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  // Truncate location for display if too long
  const displayLocation = () => {
    if (isMobile && location.length > 20) {
      return location.substring(0, 20) + "...";
    } else if (isTablet && location.length > 30) {
      return location.substring(0, 30) + "...";
    }
    return location;
  };

  return (
      <>
        <div className="bg-white py-2 px-2 sm:px-4 flex flex-wrap sm:flex-nowrap justify-between items-center text-xs sm:text-sm border-b">
          {/* Promo code section */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto mb-1 sm:mb-0">
            <span className="text-yellow-400 hidden sm:inline">✨</span>
            <span className="whitespace-nowrap">
            Get 5% Off your first order, <span className="text-red-500 font-medium">Promo: ORDER5</span>
          </span>
          </div>

          {/* Location section */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <LocationOn className="text-gray-600 text-sm sm:text-base" />

            {/* On mobile, show compact location with dropdown */}
            {isMobile ? (
                <div className="flex items-center">
                  <Box
                      component="span"
                      className="truncate max-w-[140px]"
                      sx={{ display: 'inline-block' }}
                  >
                    {displayLocation()}
                  </Box>

                  <ClickAwayListener onClickAway={handleClickAway}>
                    <div>
                      <IconButton
                          size="small"
                          onClick={toggleLocationPopper}
                          aria-label="Change location"
                      >
                        <ArrowDropDown />
                      </IconButton>

                      <Popper
                          open={open}
                          anchorEl={anchorEl}
                          placement="bottom-end"
                          style={{ zIndex: 1200 }}
                      >
                        <Paper elevation={3} sx={{ p: 1, mt: 1 }}>
                          <Button
                              fullWidth
                              startIcon={<Edit />}
                              onClick={handleOpenDialog}
                              size="small"
                          >
                            Change Location
                          </Button>
                          <Button
                              fullWidth
                              startIcon={<Place />}
                              onClick={handleUseCurrentLocation}
                              size="small"
                              sx={{ mt: 1 }}
                          >
                            Use Current Location
                          </Button>
                        </Paper>
                      </Popper>
                    </div>
                  </ClickAwayListener>
                </div>
            ) : (
                // On larger screens, show full location with change button
                <>
                  <span className="truncate max-w-[200px] md:max-w-full">{location}</span>
                  <Button color="primary" size="small" onClick={handleOpenDialog} className="whitespace-nowrap">
                    <span className="underline">Change Location</span>
                  </Button>
                </>
            )}
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