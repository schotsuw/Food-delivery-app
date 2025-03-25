import { useState, useRef, useEffect } from "react";
import React from "react";
import { motion, useInView } from "framer-motion";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  Paper, Typography, Stepper, Step, StepLabel, Button, Box, Grid, Divider, Avatar, LinearProgress, CircularProgress,
  useMediaQuery, useTheme
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

// Update the beginning of the TrackOrderPage component
const TrackOrderPage = () => {
  // Use Material-UI theme and breakpoints for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Get orderId from URL params
  const { orderId } = useParams();
  const { getOrder, trackOrder } = useOrder();

  // State to hold order details
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize all state variables here, regardless of conditionals
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
  const [lastStatus, setLastStatus] = useState(-1); // Use a default value

  // Add message history
  const [messages, setMessages] = useState([
    { sender: 'rider', message: 'I am on my way!', time: '10:45 AM' }
  ]);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // First try to get the order from our context
        let order = getOrder(orderId);

        // If not found, try to track it (which might create a mock order for demo)
        if (!order && trackOrder) {
          order = await trackOrder(orderId);
        }

        if (order) {
          setOrderDetails(order);
          // Update lastStatus based on the fetched order
          const activeStepValue = order.steps ?
              order.steps.findIndex(step => !step.completed) - 1 : -1;
          setLastStatus(activeStepValue);
          setError(null);
        } else {
          setError("Order not found");
          // Optional: set a timeout to redirect after showing error
          setTimeout(() => navigate('/no-active-orders'), 3000);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, getOrder, trackOrder, navigate]);

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
    if (orderDetails && lastStatus !== -1) {
      // Calculate active step here inside the effect
      const activeStep = orderDetails.steps ?
          orderDetails.steps.findIndex(step => !step.completed) - 1 : -1;

      if (activeStep !== lastStatus) {
        setLastStatus(activeStep);
        setPlaySound(true);
      }
    }
  }, [orderDetails, lastStatus]);

  // Show loading state
  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
    );
  }

  // Show error state
  if (error) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
          <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
          <Button variant="contained" onClick={() => navigate('/no-active-orders')}>
            View Active Orders
          </Button>
        </Box>
    );
  }

  // Redirect if no valid order
  if (!orderDetails) {
    return <Navigate to="/no-active-orders" />;
  }

  // Calculate active step here
  const activeStep = orderDetails.steps ?
      orderDetails.steps.findIndex(step => !step.completed) - 1 : -1;

  // Responsive styling adjustments
  const containerPadding = isMobile ? { px: 2, py: 4 } : { px: 4, py: 8 };
  const paperPadding = isMobile ? { p: 2 } : { p: 3 };
  const mapHeight = isMobile ? '200px' : '300px';
  const buttonSize = isMobile ? 'small' : 'medium';
  const titleVariant = isMobile ? 'h6' : 'h5';
  const subtitleVariant = isMobile ? 'subtitle2' : 'subtitle1';
  const bodyVariant = isMobile ? 'body2' : 'body1';
  const avatarSize = isMobile ? { width: 40, height: 40 } : { width: 60, height: 60 };

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
          sx={containerPadding}
      >
        <Grid container spacing={isMobile ? 2 : 4}>

          {/* Left Column - Order Status */}
          <Grid item xs={12} lg={8}>
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
              <Paper sx={{ ...paperPadding, mb: 2 }}>
                <Typography variant={titleVariant} sx={{ mb: isMobile ? 2 : 3 }}>
                  Track Order {orderDetails.orderId}
                </Typography>

                {/* Restaurant Info */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Restaurant color="primary" />
                  <Typography variant={bodyVariant}>
                    {orderDetails.restaurantName || orderDetails.restaurant || "Restaurant"}
                  </Typography>
                </Box>

                {/* Estimated Delivery Time */}
                <Box sx={{ mb: isMobile ? 3 : 4 }}>
                  <Typography variant={subtitleVariant} sx={{ mb: 1 }}>
                    Estimated Delivery Time
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <Timer />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Typography variant={isMobile ? 'h5' : 'h4'}>{deliveryTime} mins</Typography>
                    </motion.div>
                  </Box>

                  {/* ETA Progress Bar with Custom Moving Icon */}
                  <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
                    {/* Background track */}
                    <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{ height: isMobile ? 6 : 8, borderRadius: 5, bgcolor: 'grey.200' }}
                    />

                    {/* Actual progress */}
                    <LinearProgress
                        variant="determinate"
                        value={((15 - deliveryTime) / 15) * 100}
                        sx={{
                          height: isMobile ? 6 : 8,
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
                      width: isMobile ? 16 : 20,
                      height: isMobile ? 16 : 20,
                      borderRadius: '50%',
                      bgcolor: 'grey.300',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Restaurant sx={{ fontSize: isMobile ? 10 : 12 }} />
                    </Box>

                    <Box sx={{
                      position: 'absolute',
                      top: -10,
                      right: '0%',
                      transform: 'translateX(50%)',
                      width: isMobile ? 16 : 20,
                      height: isMobile ? 16 : 20,
                      borderRadius: '50%',
                      bgcolor: 'grey.300',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Home sx={{ fontSize: isMobile ? 10 : 12 }} />
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
                          top: -20,
                          left: 0,
                          transform: "translateX(-50%)",
                        }}
                    >
                      <motion.img
                          src={bikeFoodFetch}
                          alt="Delivery bike"
                          style={{
                            width: isMobile ? 30 : 40,
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
                    {orderDetails.steps && orderDetails.steps.map((step, index) => (
                        <Step key={step.label} completed={step.completed}>
                          <StepLabel>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.2 }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Box sx={{ maxWidth: isMobile ? '70%' : '80%' }}>
                                  <Typography variant={subtitleVariant}>{step.label}</Typography>
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
              <Paper sx={paperPadding}>
                <Typography variant={subtitleVariant} sx={{ mb: 2 }}>
                  Delivery Location
                </Typography>
                <Box sx={{ width: '100%', height: mapHeight, bgcolor: 'grey.200', borderRadius: 1, mb: 2 }}>
                  {mapError ? (
                      <Box sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>Unable to load map</Typography>
                        <Button
                            variant="contained"
                            onClick={() => setMapError(false)}
                            startIcon={<RefreshIcon />}
                            size={buttonSize}
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

                {/* Enhanced location info with responsive layout */}
                <Box sx={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 1,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Regent Street, E12 345, Fredericton
                    </Typography>
                  </Box>
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
          <Grid item xs={12} lg={4}>
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
              <Paper sx={paperPadding}>
                {/* Rider Details with Button Animation - responsive layout */}
                <Typography variant={subtitleVariant} sx={{ mb: 2 }}>
                  Delivery Partner
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {orderDetails.rider && (
                      <>
                        <Avatar src={orderDetails.rider.image} alt={orderDetails.rider.name} sx={avatarSize} />
                        <Box>
                          <Typography variant={subtitleVariant}>{orderDetails.rider.name}</Typography>
                          <Typography variant="body2" color="text.secondary">⭐ {orderDetails.rider.rating} Rating</Typography>
                        </Box>
                      </>
                  )}
                </Box>

                {/* Responsive button layout */}
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  mt: 2,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Phone />}
                        fullWidth
                        size={buttonSize}
                    >
                      Call
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Message />}
                        fullWidth
                        onClick={() => setOpenMessage(true)}
                        size={buttonSize}
                    >
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
                        size={buttonSize}
                    >
                      Report
                    </Button>
                  </motion.div>
                </Box>

                {/* Modals */}
                <MessageDialog
                    open={openMessage}
                    onClose={() => setOpenMessage(false)}
                    riderName={orderDetails.rider ? orderDetails.rider.name : "Driver"}
                />
                <ReportIssueDialog open={openReport} onClose={() => setOpenReport(false)} />

                <Divider sx={{ my: 3 }} />

                {/* Order Details - responsive styling */}
                <Typography variant={subtitleVariant} sx={{ mb: 2 }}>Order Details</Typography>
                <Box sx={{ mb: 3 }}>
                  {orderDetails.items && orderDetails.items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{item.quantity || 1}x {item.name}</Typography>
                        <Typography variant="body2">${item.price.toFixed(2)}</Typography>
                      </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant={subtitleVariant} fontWeight="bold">Total</Typography>
                    <Typography variant={subtitleVariant} fontWeight="bold">${orderDetails.total.toFixed(2)}</Typography>
                  </Box>
                </Box>

                {/* Message history - responsive height */}
                <Box sx={{
                  mt: 2,
                  mb: 2,
                  maxHeight: isMobile ? '120px' : '150px',
                  overflowY: 'auto',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  p: 1
                }}>
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

                {/* Responsive button spacing */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      size={buttonSize}
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
                      size={buttonSize}
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