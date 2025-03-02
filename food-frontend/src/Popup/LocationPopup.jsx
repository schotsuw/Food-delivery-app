import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, CircularProgress, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
export default function LocationPopup() {
  const [showPopup, setShowPopup] = useState(true);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); // New: Loading state
  const [error, setError] = useState("");

  useEffect(() => {
    // Automatically request location when the component mounts
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          getUserLocation();
        }
      });
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true); // Start loading when fetching location
      setError(""); // Clear previous errors

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShowPopup(false);
          setLoading(false); // Stop loading when location is received
        },
        (error) => {
          setError("Location access denied. Please enable location services.");
          setLoading(false); // Stop loading if there's an error
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 cursor-pointer"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <LocationOnIcon className="text-red-500 text-4xl mb-2" />
            <h3 className="text-lg font-semibold">Allow Location Access?</h3>
            <p className="text-gray-600 text-sm mb-4">
              We need your location to show the nearest restaurants & services.
            </p>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            {/* New: Show loading message when fetching location */}
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <CircularProgress size={24} />
                <Typography variant="body2" className="text-gray-500">
                  Getting your location...
                </Typography>
              </div>
            ) : (
              <div className="flex justify-center gap-4 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                  <Button
                    variant="contained"
                    className="!bg-red-500 !text-white !px-6 !py-2 !rounded-full"
                    sx={{ borderRadius: "50px", padding: "8px 24px" }}
                    onClick={getUserLocation}
                    disabled={loading} // Disable button while loading
                  >
                    Allow
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                  <Button
                    variant="outlined"
                    className="!border-gray-500 !text-gray-700 !px-6 !py-2 !rounded-full"
                    sx={{ borderRadius: "50px", padding: "8px 24px" }}
                    onClick={() => setShowPopup(false)}
                    disabled={loading} // Disable Deny button while loading
                  >
                    Deny
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
