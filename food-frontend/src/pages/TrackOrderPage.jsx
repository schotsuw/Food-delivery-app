import { useState, useRef, useEffect } from "react";
import React from "react";
import { motion, useInView } from "framer-motion";
import { useParams, Navigate } from "react-router-dom";
import { 
  Paper, Typography, Stepper, Step, StepLabel, Button, Box, Grid, Divider, Avatar, LinearProgress, CircularProgress
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Restaurant, Timer, Phone, Message, LocationOn, Cancel, Home
} from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DeliveryMapSimple from "../components/DeliveryMapSimple";
import ReportIssueDialog from "../Dialogs/ReportIssueDialog";
import MessageDialog from "../Dialogs/MessageDialog";
import CancelOrderDialog from "../Dialogs/CalcelOrderDialog";
import bikeFoodFetch from "../assets/bikeFoodFetch.png";
import { useOrder } from "../context/OrderContext";
import ContentCopy from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";

// Memoize the map component to prevent unnecessary re-renders
const MemoizedDeliveryMap = React.memo(DeliveryMapSimple);

const TrackOrderPage = () => {
  // Get orderId from URL params
  const { orderId } = useParams();
  const { getOrder } = useOrder();
  
  // Get order details from context
  const orderDetails = getOrder(orderId);
  
  // Redirect if no valid order
  if (!orderDetails) {
    return <Navigate to="/no-active-orders" />;
  }

  const activeStep = orderDetails.steps.findIndex(step => !step.completed) - 1;
  const [deliveryTime, setDeliveryTime] = useState(3);
  const [openReport, setOpenReport] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [openCancelOrder, setOpenCancelOrder] = useState(false); 
  const [mapError, setMapError] = useState(false);
  const [riderLocation, setRiderLocation] = useState({
    lat: 45.945,
    lng: -66.641,
  });

  const [playSound, setPlaySound] = useState(false);
  const [lastStatus, setLastStatus] = useState(activeStep);
  
  // Add message history
  const [messages, setMessages] = useState([
    { sender: 'rider', message: 'I am on my way!', time: '10:45 AM' }
  ]);

  // Countdown timer and other effects remain the same
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rider movement simulation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setRiderLocation(prev => ({
        lat: prev.lat + (Math.random() * 0.002 - 0.001),
        lng: prev.lng + (Math.random() * 0.002 - 0.001)
      }));
    }, 5000);
    return () => clearInterval(moveInterval);
  }, []);

  // Effect to play sound on status change
  useEffect(() => {
    if (activeStep !== lastStatus) {
      setLastStatus(activeStep);
      setPlaySound(true);
    }
  }, [activeStep, lastStatus]);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      className="container mx-auto px-4 py-8"
    >
      <Grid container spacing={4}>
        
        {/* Left Column - Order Status */}
        <Grid item xs={12} md={8}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Track Order {orderDetails.orderId}
              </Typography>

              {/* Restaurant Info */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Restaurant color="primary" />
                <Typography variant="body1">
                  {orderDetails.restaurant}
                </Typography>
              </Box>

              {/* Estimated Delivery Time */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Estimated Delivery Time
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                  <Timer />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Typography variant="h4">{deliveryTime} mins</Typography>
                  </motion.div>
                </Box>

                {/* ETA Progress Bar with Custom Moving Icon */}
                <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
                  {/* Background track */}
                  <LinearProgress 
                    variant="determinate" 
                    value={100}
                    sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.200' }}
                  />
                  
                    {/* Actual progress */}
                    <LinearProgress 
                      variant="determinate" 
                      value={((15 - deliveryTime) / 15) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 5, 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                      }}
                    />
  
                    {/* Key locations markers */}
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      left: '0%', 
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'grey.300',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <Restaurant sx={{ fontSize: 12 }} />
                </Box>
  
                <Box sx={{ 
                  position: 'absolute', 
                  top: -10, 
                  right: '0%', 
                  transform: 'translateX(50%)',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Home sx={{ fontSize: 12 }} />
                </Box>
  
                  {/* Moving rider icon - enhanced */}
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ 
                      x: `${((15 - deliveryTime) / 15) * 100}%`,
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      x: { duration: 0.5, ease: "easeInOut" },
                      y: { repeat: Infinity, duration: 1.5 }
                    }}
                    style={{
                      position: 'absolute',
                      top: -25,
                      left: 0,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <motion.img
                      src={bikeFoodFetch}
                      alt="Delivery bike"
                      style={{
                        width: 40,
                        height: "auto",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  </motion.div>
                </Box>
              </Box>

              {/* Order Tracking Stepper */}
              <Box ref={sectionRef}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {orderDetails.steps.map((step, index) => (
                    <Step key={step.label} completed={step.completed}>
                      <StepLabel>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: index * 0.2 }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1">{step.label}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {step.description}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {step.time}
                            </Typography>
                          </Box>
                        </motion.div>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Paper>
          </motion.div>

          {/* Map View with Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Location
              </Typography>
              <Box sx={{ width: '100%', height: '300px', bgcolor: 'grey.200', borderRadius: 1, mb: 2 }}>
                {mapError ? (
                  <Box sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>Unable to load map</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => setMapError(false)}
                      startIcon={<RefreshIcon />}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <MemoizedDeliveryMap 
                    riderLocation={riderLocation} 
                    onError={() => setMapError(true)} 
                  />
                )}
              </Box>
              
              {/* Enhanced location info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Regent Street, E12 345, Fredericton
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<ContentCopy fontSize="small" />}
                  onClick={() => {
                    navigator.clipboard.writeText("Regent Street, E12 345, Fredericton");
                    // Add a toast notification here if you have one implemented
                  }}
                >
                  Copy
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Right Column - Order Details */}
        <Grid item xs={12} md={4}>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Paper sx={{ p: 3 }}>
              {/* Rider Details with Button Animation */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Partner
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={orderDetails.rider.image} alt={orderDetails.rider.name} sx={{ width: 60, height: 60 }} />
                <Box>
                  <Typography variant="subtitle1">{orderDetails.rider.name}</Typography>
                  <Typography variant="body2" color="text.secondary">⭐ {orderDetails.rider.rating} Rating</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                  <Button variant="outlined" startIcon={<Phone />} fullWidth>Call</Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                  <Button variant="outlined" startIcon={<Message />} fullWidth onClick={() => setOpenMessage(true)}>
                    Message
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ReportProblemIcon />}
                    color="error"
                    fullWidth
                    onClick={() => setOpenReport(true)}
                  >
                    Report
                  </Button>
                </motion.div>
              </Box>

              {/* Modals */}
              <MessageDialog open={openMessage} onClose={() => setOpenMessage(false)} riderName={orderDetails.rider.name} />
              <ReportIssueDialog open={openReport} onClose={() => setOpenReport(false)} />
              
              <Divider sx={{ my: 3 }} />

              {/* Order Details */}
              <Typography variant="h6" sx={{ mb: 2 }}>Order Details</Typography>
              <Box sx={{ mb: 3 }}>
                {orderDetails.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.quantity}x {item.name}</Typography>
                    <Typography variant="body2">${item.price.toFixed(2)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">${orderDetails.total.toFixed(2)}</Typography>
                </Box>
              </Box>

              {/* Message history */}
              <Box sx={{ mt: 2, mb: 2, maxHeight: '150px', overflowY: 'auto', bgcolor: 'grey.100', borderRadius: 1, p: 1 }}>
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <Box key={idx} sx={{ 
                      display: 'flex', 
                      flexDirection: msg.sender === 'rider' ? 'row' : 'row-reverse', 
                      mb: 1 
                    }}>
                      <Box sx={{ 
                        bgcolor: msg.sender === 'rider' ? 'primary.light' : 'secondary.light',
                        borderRadius: 2,
                        p: 1,
                        maxWidth: '80%'
                      }}>
                        <Typography variant="body2">{msg.message}</Typography>
                        <Typography variant="caption" color="text.secondary">{msg.time}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">No messages yet</Typography>
                )}
              </Box>

              {/* Order Actions */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View Order Details
                </Button>
              </motion.div>

              {/* Add Cancel Order button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                    startIcon={<Cancel />}
                    onClick={() => setOpenCancelOrder(true)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Your Order
                  </Button>
                </motion.div>
                {/* Add the CancelOrderDialog */}
                <CancelOrderDialog 
                  open={openCancelOrder} 
                  onClose={() => setOpenCancelOrder(false)} 
                  orderId={orderId}
                />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      {playSound && (
        <audio 
          src="/notification-sound.mp3" 
          autoPlay 
          onEnded={() => setPlaySound(false)}
        />
      )}
    </motion.div>
  );
};

export default TrackOrderPage;