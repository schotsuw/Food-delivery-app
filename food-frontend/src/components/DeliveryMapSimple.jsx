import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const DeliveryMapSimple = ({ riderLocation }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY; // Use Environment Variable

  const [currentLocation, setCurrentLocation] = useState(riderLocation || {
    lat: 45.945, // Default location (Update with real data)
    lng: -66.641,
  });

  // Simulate rider moving every 5 seconds (Mock tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation((prev) => ({
        lat: prev.lat + 0.0003, // Simulated movement
        lng: prev.lng + 0.0003,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100%", height: "300px", borderRadius: "10px" }}
        defaultCenter={currentLocation}
        defaultZoom={14}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {/* Rider's Location Marker */}
        <Marker position={currentLocation} />
      </Map>
    </APIProvider>
  );
};

export default DeliveryMapSimple;
