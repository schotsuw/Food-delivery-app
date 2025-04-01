"use client"

import { useState, useRef, useEffect } from "react"
import React from "react"
import { motion, useInView } from "framer-motion"
import { useParams, Navigate, useNavigate } from "react-router-dom"
import {
    Paper,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    Box,
    Grid,
    Divider,
    Avatar,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
} from "@mui/material"
import { Restaurant, Timer, Phone, Message, LocationOn, Cancel, CheckCircle } from "@mui/icons-material"
import ReportProblemIcon from "@mui/icons-material/ReportProblem"
import DeliveryMapSimple from "../components/DeliveryMapSimple"
import ReportIssueDialog from "../Dialogs/ReportIssueDialog"
import MessageDialog from "../Dialogs/MessageDialog"
import CancelOrderDialog from "../Dialogs/CalcelOrderDialog"
import { useOrder } from "../context/OrderContext"
import ContentCopy from "@mui/icons-material/ContentCopy"
import RefreshIcon from "@mui/icons-material/Refresh"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

// Memoize the map component to prevent unnecessary re-renders
const MemoizedDeliveryMap = React.memo(DeliveryMapSimple)

// Update the beginning of the TrackOrderPage component
const TrackOrderPage = () => {
    // Use Material-UI theme and breakpoints for responsive design
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const isTablet = useMediaQuery(theme.breakpoints.down("md"))
    const navigate = useNavigate()

    // Get orderId from URL params
    const { orderId } = useParams()
    const { getOrder, trackOrder } = useOrder()

    // State to hold order details
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initialize all state variables here, regardless of conditionals
    const [deliveryTime, setDeliveryTime] = useState(3)
    const [openReport, setOpenReport] = useState(false)
    const [openMessage, setOpenMessage] = useState(false)
    const [openCancelOrder, setOpenCancelOrder] = useState(false)
    const [mapError, setMapError] = useState(false)
    const [riderLocation, setRiderLocation] = useState({
        lat: 45.945,
        lng: -66.641,
    })
    const [playSound, setPlaySound] = useState(false)
    const [lastStatus, setLastStatus] = useState(-1) // Use a default value

    const [autoTransition, setAutoTransition] = useState(true)
    const [currentStatusIndex, setCurrentStatusIndex] = useState(1) // Start at "Preparing" (index 1)
    const [statusTimer, setStatusTimer] = useState(60) // 60 seconds countdown for each status
    const [statusTimerInterval, setStatusTimerInterval] = useState(null)

    // Add message history
    const [messages, setMessages] = useState([{ sender: "rider", message: "I am on my way!", time: "10:45 AM" }])

    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true })

    // In TrackOrderPage.jsx, update the useEffect that fetches order details
    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true)
            try {
                // First try to get the order from our context
                let order = getOrder(orderId)

                // If not found, try to track it
                if (!order && trackOrder) {
                    order = await trackOrder(orderId)
                }

                if (order) {
                    // Transform backend order format to frontend format if needed
                    const formattedOrder = {
                        ...order,
                        // Ensure all required props exist for the UI
                        orderId: order.id || order.orderId,
                        steps: order.steps || [
                            {
                                label: "Order Confirmed",
                                description: "Your order has been received",
                                time: new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                completed:
                                    order.status === "CONFIRMED" ||
                                    order.status === "PREPARING" ||
                                    order.status === "OUT_FOR_DELIVERY" ||
                                    order.status === "DELIVERED",
                            },
                            {
                                label: "Preparing",
                                description: "Restaurant is preparing your food",
                                time: "",
                                completed:
                                    order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERED",
                            },
                            {
                                label: "On the Way",
                                description: "Your order is on the way",
                                time: "",
                                completed: order.status === "OUT_FOR_DELIVERY" || order.status === "DELIVERED",
                            },
                            {
                                label: "Delivered",
                                description: "Enjoy your meal!",
                                time: "",
                                completed: order.status === "DELIVERED",
                            },
                        ],
                        rider: order.rider || {
                            name: "John Doe",
                            image: "/placeholder-rider.jpg",
                            rating: 4.8,
                        },
                    }

                    setOrderDetails(formattedOrder)
                    setError(null)
                } else {
                    setError("Order not found")
                    setTimeout(() => navigate("/no-active-orders"), 3000)
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("Failed to load order details")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [orderId, getOrder, trackOrder, navigate])

    // Countdown timer and other effects remain the same
    useEffect(() => {
        if (!autoTransition || !orderDetails) return

        // Clear any existing interval
        if (statusTimerInterval) {
            clearInterval(statusTimerInterval)
        }

        // Calculate active step locally inside the effect
        const activeStep = orderDetails.steps ? orderDetails.steps.findIndex((step) => !step.completed) - 1 : -1

        // If already delivered (activeStep === 3 or all steps completed), don't start timer
        if (activeStep === 3 || (orderDetails.steps && orderDetails.steps.every((step) => step.completed))) {
            return
        }

        // Set up the interval for status transitions
        const interval = setInterval(() => {
            setStatusTimer((prevTime) => {
                // When timer reaches 0, move to next status
                if (prevTime <= 1) {
                    // Move to the next status
                    setCurrentStatusIndex((prevIndex) => {
                        const nextIndex = Math.min(prevIndex + 1, 3) // Max index is 3 (Delivered)

                        // Update the orderDetails steps to reflect the new status
                        if (orderDetails && orderDetails.steps) {
                            const updatedSteps = [...orderDetails.steps]

                            // Mark the current step as completed
                            if (prevIndex < updatedSteps.length) {
                                updatedSteps[prevIndex] = {
                                    ...updatedSteps[prevIndex],
                                    completed: true,
                                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                }
                            }

                            // Update the order details with the new steps
                            setOrderDetails({
                                ...orderDetails,
                                steps: updatedSteps,
                            })

                            // Play notification sound for status change
                            setPlaySound(true)

                            // Update delivery time based on status
                            if (nextIndex === 2) {
                                // On the Way
                                setDeliveryTime(2) // 2 minutes until delivery
                            } else if (nextIndex === 3) {
                                // Delivered
                                setDeliveryTime(0) // 0 minutes, already delivered
                                // Stop the interval when we reach "Delivered"
                                clearInterval(interval)
                                setStatusTimerInterval(null)
                            }
                        }

                        return nextIndex
                    })

                    // Reset the timer for the next status
                    return 60
                }
                return prevTime - 1
            })
        }, 1000) // Update every second

        setStatusTimerInterval(interval)

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [autoTransition, orderDetails, currentStatusIndex])

    // Rider movement simulation
    useEffect(() => {
        const moveInterval = setInterval(() => {
            setRiderLocation((prev) => ({
                lat: prev.lat + (Math.random() * 0.002 - 0.001),
                lng: prev.lng + (Math.random() * 0.002 - 0.001),
            }))
        }, 5000)
        return () => clearInterval(moveInterval)
    }, [])

    // Effect to play sound on status change
    useEffect(() => {
        if (orderDetails && lastStatus !== -1) {
            // Calculate active step here inside the effect
            const activeStep = orderDetails.steps ? orderDetails.steps.findIndex((step) => !step.completed) - 1 : -1

            if (activeStep !== lastStatus) {
                setLastStatus(activeStep)
                setPlaySound(true)
            }
        }
    }, [orderDetails, lastStatus])

    useEffect(() => {
        if (orderDetails && orderDetails.steps) {
            // Find the current active step index
            const activeStepIndex = orderDetails.steps.findIndex((step) => !step.completed)
            if (activeStepIndex > 0) {
                setCurrentStatusIndex(activeStepIndex - 1)
            }
        }
    }, [orderDetails])

    // Show loading state
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        )
    }

    // Show error state
    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" onClick={() => navigate("/no-active-orders")}>
                    View Active Orders
                </Button>
            </Box>
        )
    }

    // Redirect if no valid order
    if (!orderDetails) {
        return <Navigate to="/no-active-orders" />
    }

    // Calculate active step here
    const activeStep = orderDetails.steps ? orderDetails.steps.findIndex((step) => !step.completed) - 1 : -1

    // Responsive styling adjustments
    const containerPadding = isMobile ? { px: 2, py: 4 } : { px: 4, py: 8 }
    const paperPadding = isMobile ? { p: 2 } : { p: 3 }
    const mapHeight = isMobile ? "200px" : "300px"
    const buttonSize = isMobile ? "small" : "medium"
    const titleVariant = isMobile ? "h6" : "h5"
    const subtitleVariant = isMobile ? "subtitle2" : "subtitle1"
    const bodyVariant = isMobile ? "body2" : "body1"
    const avatarSize = isMobile ? { width: 40, height: 40 } : { width: 60, height: 60 }

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
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Paper
                            sx={{
                                ...paperPadding,
                                mb: 2,
                                borderRadius: 2,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography
                                variant={titleVariant}
                                sx={{
                                    mb: isMobile ? 2 : 3,
                                    fontWeight: "bold",
                                    color: theme.palette.primary.main,
                                }}
                            >
                                Track Order {orderDetails.orderId}
                            </Typography>

                            {/* Restaurant Info */}
                            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                <Restaurant color="primary" />
                                <Typography variant={bodyVariant} sx={{ fontWeight: "medium" }}>
                                    {orderDetails.restaurantName || orderDetails.restaurant || "Restaurant"}
                                </Typography>
                            </Box>

                            {/* Enhanced Estimated Delivery Time Card */}
                            <Card
                                elevation={0}
                                sx={{
                                    mb: 4,
                                    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography
                                            variant={subtitleVariant}
                                            sx={{
                                                fontWeight: "bold",
                                                color: theme.palette.text.primary,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <AccessTimeIcon color="primary" />
                                            Estimated Delivery Time
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                bgcolor: theme.palette.primary.main,
                                                color: "white",
                                                py: 0.5,
                                                px: 1.5,
                                                borderRadius: 2,
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                            }}
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{
                                                    repeat: deliveryTime > 0 ? Number.POSITIVE_INFINITY : 0,
                                                    duration: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant={isMobile ? "h6" : "h5"}
                                                    sx={{
                                                        fontWeight: "bold",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {deliveryTime}{" "}
                                                    <Typography component="span" variant="body2">
                                                        {deliveryTime === 1 ? "min" : "mins"}
                                                    </Typography>
                                                </Typography>
                                            </motion.div>
                                        </Box>
                                    </Box>

                                    {/* Clean Progress Tracker */}
                                    <Box sx={{ position: "relative", width: "100%", mt: 4, mb: 3 }}>
                                        {/* Status labels - positioned above the points */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                position: "absolute",
                                                width: "100%",
                                                top: -25,
                                                left: 0,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: orderDetails.steps[0].completed ? "success.main" : "text.secondary",
                                                    fontWeight: orderDetails.steps[0].completed ? "bold" : "normal",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Confirmed
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: orderDetails.steps[1].completed
                                                        ? "success.main"
                                                        : activeStep === 0
                                                            ? "primary.main"
                                                            : "text.secondary",
                                                    fontWeight: orderDetails.steps[1].completed || activeStep === 0 ? "bold" : "normal",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Preparing
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: orderDetails.steps[2].completed
                                                        ? "success.main"
                                                        : activeStep === 1
                                                            ? "primary.main"
                                                            : "text.secondary",
                                                    fontWeight: orderDetails.steps[2].completed || activeStep === 1 ? "bold" : "normal",
                                                    textAlign: "center",
                                                }}
                                            >
                                                On the Way
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: orderDetails.steps[3].completed
                                                        ? "success.main"
                                                        : activeStep === 2
                                                            ? "primary.main"
                                                            : "text.secondary",
                                                    fontWeight: orderDetails.steps[3].completed || activeStep === 2 ? "bold" : "normal",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Delivered
                                            </Typography>
                                        </Box>

                                        {/* Background track */}
                                        <Box
                                            sx={{
                                                height: 6,
                                                width: "100%",
                                                bgcolor: "rgba(0,0,0,0.08)",
                                                borderRadius: 3,
                                                position: "relative",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* Progress fill */}
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    width: `${
                                                        activeStep === -1
                                                            ? 0
                                                            : activeStep === 0
                                                                ? 25
                                                                : activeStep === 1
                                                                    ? 50 + ((60 - statusTimer) / 60) * 25
                                                                    : activeStep === 2
                                                                        ? 75 + ((60 - statusTimer) / 60) * 25
                                                                        : 100
                                                    }%`,
                                                    bgcolor: "primary.main",
                                                    borderRadius: 3,
                                                    transition: "width 0.5s ease-out",
                                                }}
                                            />
                                        </Box>

                                        {/* Status markers */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative", mt: -3 }}>
                                            {/* Confirmed */}
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    bgcolor: orderDetails.steps[0].completed ? "success.main" : "grey.400",
                                                    border: "2px solid white",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                    zIndex: 2,
                                                }}
                                            />

                                            {/* Preparing */}
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    bgcolor: orderDetails.steps[1].completed
                                                        ? "success.main"
                                                        : activeStep === 0
                                                            ? "primary.main"
                                                            : "grey.400",
                                                    border: "2px solid white",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                    zIndex: 2,
                                                    animation: activeStep === 0 ? "pulse 1.5s infinite" : "none",
                                                    "@keyframes pulse": {
                                                        "0%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.7)" },
                                                        "70%": { boxShadow: "0 0 0 6px rgba(25, 118, 210, 0)" },
                                                        "100%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0)" },
                                                    },
                                                }}
                                            />

                                            {/* On the Way */}
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    bgcolor: orderDetails.steps[2].completed
                                                        ? "success.main"
                                                        : activeStep === 1
                                                            ? "primary.main"
                                                            : "grey.400",
                                                    border: "2px solid white",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                    zIndex: 2,
                                                    animation: activeStep === 1 ? "pulse 1.5s infinite" : "none",
                                                    "@keyframes pulse": {
                                                        "0%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.7)" },
                                                        "70%": { boxShadow: "0 0 0 6px rgba(25, 118, 210, 0)" },
                                                        "100%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0)" },
                                                    },
                                                }}
                                            />

                                            {/* Delivered */}
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    bgcolor: orderDetails.steps[3].completed
                                                        ? "success.main"
                                                        : activeStep === 2
                                                            ? "primary.main"
                                                            : "grey.400",
                                                    border: "2px solid white",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                    zIndex: 2,
                                                    animation: activeStep === 2 ? "pulse 1.5s infinite" : "none",
                                                    "@keyframes pulse": {
                                                        "0%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.7)" },
                                                        "70%": { boxShadow: "0 0 0 6px rgba(25, 118, 210, 0)" },
                                                        "100%": { boxShadow: "0 0 0 0 rgba(25, 118, 210, 0)" },
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Status timer indicator */}
                                        {activeStep >= 0 && activeStep < 3 && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 20,
                                                    left:
                                                        activeStep === 0
                                                            ? "25%"
                                                            : activeStep === 1
                                                                ? `${50 + ((60 - statusTimer) / 60) * 25}%`
                                                                : `${75 + ((60 - statusTimer) / 60) * 25}%`,
                                                    transform: "translateX(-50%)",
                                                    bgcolor: "white",
                                                    borderRadius: "4px",
                                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                                    px: 1,
                                                    py: 0.5,
                                                    border: "1px solid",
                                                    borderColor: "primary.main",
                                                    transition: "left 0.8s ease-in-out",
                                                    zIndex: 3,
                                                }}
                                            >
                                                <Typography variant="caption" fontWeight="bold" color="primary.main">
                                                    {statusTimer}s
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Current status message */}
                                    <Box
                                        sx={{
                                            mt: 3,
                                            textAlign: "center",
                                            bgcolor: "white",
                                            borderRadius: 2,
                                            p: 2,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: "medium",
                                                color:
                                                    activeStep === -1
                                                        ? "text.secondary"
                                                        : activeStep === 3 || deliveryTime === 0
                                                            ? "success.main"
                                                            : "primary.main",
                                            }}
                                        >
                                            {activeStep === -1
                                                ? "Waiting for restaurant to confirm your order"
                                                : activeStep === 0
                                                    ? "Your order is being prepared"
                                                    : activeStep === 1
                                                        ? `Your order is on the way, arriving in ${deliveryTime} minutes`
                                                        : activeStep === 2
                                                            ? deliveryTime > 0
                                                                ? `Your order will be delivered in ${deliveryTime} minutes`
                                                                : "Your order has arrived!"
                                                            : "Your order has been delivered!"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Order Tracking Stepper - Fixed Version */}
                            {/* Enhanced Order Tracking Stepper with Visual Indicators and Animations */}
                            <Box sx={{ my: 3 }}>
                                <Typography
                                    variant={subtitleVariant}
                                    sx={{
                                        mb: 2,
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <CheckCircle fontSize="small" color="primary" />
                                    Order Status Details
                                </Typography>

                                <Stepper
                                    activeStep={activeStep}
                                    orientation="vertical"
                                    sx={{
                                        "& .MuiStepConnector-line": {
                                            minHeight: 40,
                                            borderLeftWidth: 3,
                                        },
                                        "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                                            borderColor: "primary.main",
                                            borderLeftStyle: "dashed",
                                        },
                                        "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                                            borderColor: "success.main",
                                        },
                                    }}
                                >
                                    {orderDetails.steps &&
                                        orderDetails.steps.map((step, index) => (
                                            <Step key={step.label} completed={step.completed} sx={{ mb: 2 }}>
                                                <StepLabel
                                                    StepIconProps={{
                                                        sx: {
                                                            color: step.completed
                                                                ? "success.main"
                                                                : index === activeStep + 1
                                                                    ? "primary.main"
                                                                    : undefined,
                                                            fontSize: index === activeStep + 1 ? 28 : 24,
                                                            transition: "all 0.3s ease",
                                                            "&.Mui-active, &.Mui-completed": {
                                                                boxShadow: 3,
                                                                borderRadius: "50%",
                                                                p: 0.5,
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "flex-start",
                                                            flexWrap: "wrap",
                                                            width: "100%",
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            bgcolor: index === activeStep + 1 ? "rgba(25, 118, 210, 0.08)" : "transparent",
                                                            transition: "background-color 0.3s ease",
                                                            transform: index === activeStep + 1 ? "scale(1.02)" : "scale(1)",
                                                            boxShadow: index === activeStep + 1 ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                                                            transition: "all 0.5s ease",
                                                        }}
                                                    >
                                                        <Box sx={{ maxWidth: isMobile ? "70%" : "80%" }}>
                                                            <Typography
                                                                variant={subtitleVariant}
                                                                sx={{
                                                                    fontWeight: index === activeStep + 1 ? "bold" : "medium",
                                                                    color: index === activeStep + 1 ? "primary.main" : "text.primary",
                                                                    transition: "all 0.3s ease",
                                                                }}
                                                            >
                                                                {step.label}
                                                                {index === activeStep + 1 && (
                                                                    <Box
                                                                        component="span"
                                                                        sx={{
                                                                            display: "inline-block",
                                                                            ml: 1,
                                                                            px: 1,
                                                                            py: 0.25,
                                                                            bgcolor: "primary.main",
                                                                            color: "white",
                                                                            borderRadius: 1,
                                                                            fontSize: "0.75rem",
                                                                        }}
                                                                    >
                                                                        Current
                                                                    </Box>
                                                                )}
                                                                {index === activeStep + 1 && (
                                                                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                                                        <Box
                                                                            component="div"
                                                                            sx={{
                                                                                width: 40,
                                                                                height: 40,
                                                                                borderRadius: "50%",
                                                                                border: "3px solid",
                                                                                borderColor: "primary.main",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                position: "relative",
                                                                                overflow: "hidden",
                                                                            }}
                                                                        >
                                                                            <Typography variant="caption" fontWeight="bold">
                                                                                {statusTimer}s
                                                                            </Typography>
                                                                            <Box
                                                                                component="div"
                                                                                sx={{
                                                                                    position: "absolute",
                                                                                    bottom: 0,
                                                                                    left: 0,
                                                                                    width: "100%",
                                                                                    height: `${(statusTimer / 60) * 100}%`,
                                                                                    bgcolor: "rgba(25, 118, 210, 0.2)",
                                                                                    transition: "height 1s linear",
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        <Typography variant="caption" color="primary.main">
                                                                            Moving to next status in {statusTimer}s
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: "block",
                                                                    mt: 0.5,
                                                                    fontWeight: index === activeStep + 1 ? "medium" : "normal",
                                                                }}
                                                            >
                                                                {step.description}

                                                                {/* Estimated time for upcoming steps */}
                                                                {index > activeStep + 1 && deliveryTime > 0 && (
                                                                    <Typography
                                                                        component="span"
                                                                        variant="caption"
                                                                        sx={{
                                                                            display: "block",
                                                                            mt: 0.5,
                                                                            color: "text.secondary",
                                                                            fontStyle: "italic",
                                                                        }}
                                                                    >
                                                                        {`Est. in ${deliveryTime - (index - activeStep - 1) * 2} mins`}
                                                                    </Typography>
                                                                )}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            {step.time && (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: "medium",
                                                                        color: step.completed ? "success.main" : "text.secondary",
                                                                    }}
                                                                >
                                                                    {step.time}
                                                                </Typography>
                                                            )}

                                                            {/* Status indicator */}
                                                            {step.completed ? (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: "success.main",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    <span style={{ fontSize: "1.2rem", marginRight: "4px" }}>✓</span> Complete
                                                                </Typography>
                                                            ) : index === activeStep + 1 ? (
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    <Box
                                                                        component="span"
                                                                        sx={{
                                                                            width: 8,
                                                                            height: 8,
                                                                            borderRadius: "50%",
                                                                            bgcolor: "primary.main",
                                                                            mr: 0.5,
                                                                            animation: "pulse 1.5s infinite",
                                                                            "@keyframes pulse": {
                                                                                "0%": { opacity: 1 },
                                                                                "50%": { opacity: 0.3 },
                                                                                "100%": { opacity: 1 },
                                                                            },
                                                                        }}
                                                                    />
                                                                    <Typography variant="caption" color="primary">
                                                                        In Progress
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                                                                    Pending
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                </Stepper>

                                {/* Auto-transition toggle button */}
                                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                                    <Button
                                        variant={autoTransition ? "contained" : "outlined"}
                                        color={autoTransition ? "primary" : "secondary"}
                                        onClick={() => setAutoTransition(!autoTransition)}
                                        startIcon={autoTransition ? <Timer /> : <Cancel />}
                                        size={buttonSize}
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: autoTransition ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                                            px: 3,
                                        }}
                                    >
                                        {autoTransition ? "Auto-Transition Enabled" : "Enable Auto-Transition"}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Map View with Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Paper
                            sx={{
                                ...paperPadding,
                                borderRadius: 2,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography
                                variant={subtitleVariant}
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <LocationOn fontSize="small" color="primary" />
                                Delivery Location
                            </Typography>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: mapHeight,
                                    bgcolor: "grey.200",
                                    borderRadius: 2,
                                    mb: 2,
                                    overflow: "hidden",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                }}
                            >
                                {mapError ? (
                                    <Box
                                        sx={{
                                            p: 2,
                                            textAlign: "center",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            Unable to load map
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() => setMapError(false)}
                                            startIcon={<RefreshIcon />}
                                            size={buttonSize}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Retry
                                        </Button>
                                    </Box>
                                ) : (
                                    <MemoizedDeliveryMap riderLocation={riderLocation} onError={() => setMapError(true)} />
                                )}
                            </Box>

                            {/* Enhanced location info with responsive layout */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: isMobile ? "flex-start" : "center",
                                    gap: 1,
                                    flexDirection: isMobile ? "column" : "row",
                                    justifyContent: "space-between",
                                    bgcolor: "rgba(0,0,0,0.02)",
                                    p: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LocationOn fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Regent Street, E12 345, Fredericton
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<ContentCopy fontSize="small" />}
                                    onClick={() => {
                                        navigator.clipboard.writeText("Regent Street, E12 345, Fredericton")
                                        // Add a toast notification here if you have one implemented
                                    }}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Right Column - Order Details */}
                <Grid item xs={12} lg={4}>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <Paper
                            sx={{
                                ...paperPadding,
                                borderRadius: 2,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            {/* Rider Details with Button Animation - responsive layout */}
                            <Typography
                                variant={subtitleVariant}
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <LocalShippingIcon fontSize="small" color="primary" />
                                Delivery Partner
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    bgcolor: "rgba(0,0,0,0.02)",
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            >
                                {orderDetails.rider && (
                                    <>
                                        <Avatar
                                            src={orderDetails.rider.image}
                                            alt={orderDetails.rider.name}
                                            sx={{
                                                ...avatarSize,
                                                border: "2px solid white",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                            }}
                                        />
                                        <Box>
                                            <Typography variant={subtitleVariant} fontWeight="bold">
                                                {orderDetails.rider.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ⭐ {orderDetails.rider.rating} Rating
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>

                            {/* Responsive button layout */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    mt: 2,
                                    flexDirection: isMobile ? "column" : "row",
                                }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ flex: 1 }}>
                                    <Button variant="outlined" startIcon={<Phone />} fullWidth size={buttonSize} sx={{ borderRadius: 2 }}>
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
                                        sx={{ borderRadius: 2 }}
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
                                        sx={{ borderRadius: 2 }}
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
                            <Typography
                                variant={subtitleVariant}
                                sx={{
                                    mb: 2,
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Restaurant fontSize="small" color="primary" />
                                Order Details
                            </Typography>
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    bgcolor: "rgba(0,0,0,0.02)",
                                    borderRadius: 2,
                                }}
                            >
                                {orderDetails.items &&
                                    orderDetails.items.map((item, index) => (
                                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body2">
                                                {item.quantity || 1}x {item.name}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                ${item.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    ))}
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant={subtitleVariant} fontWeight="bold">
                                        Total
                                    </Typography>
                                    <Typography variant={subtitleVariant} fontWeight="bold" color="primary.main">
                                        ${(orderDetails.total || orderDetails.amount || 0).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Message history - responsive height */}
                            <Typography
                                variant={subtitleVariant}
                                sx={{
                                    mb: 1,
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Message fontSize="small" color="primary" />
                                Messages
                            </Typography>
                            <Box
                                sx={{
                                    mt: 1,
                                    mb: 2,
                                    maxHeight: isMobile ? "120px" : "150px",
                                    overflowY: "auto",
                                    bgcolor: "grey.100",
                                    borderRadius: 2,
                                    p: 2,
                                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                {messages.length > 0 ? (
                                    messages.map((msg, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                display: "flex",
                                                flexDirection: msg.sender === "rider" ? "row" : "row-reverse",
                                                mb: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    bgcolor: msg.sender === "rider" ? "primary.light" : "secondary.light",
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    maxWidth: "80%",
                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                <Typography variant="body2">{msg.message}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {msg.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        No messages yet
                                    </Typography>
                                )}
                            </Box>

                            {/* Responsive button spacing */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        py: 1.2,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    }}
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
                                    sx={{
                                        mt: 2,
                                        borderRadius: 2,
                                        py: 1.2,
                                    }}
                                    size={buttonSize}
                                >
                                    Cancel Your Order
                                </Button>
                            </motion.div>

                            {/* Add the CancelOrderDialog */}
                            <CancelOrderDialog open={openCancelOrder} onClose={() => setOpenCancelOrder(false)} orderId={orderId} />
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
            {playSound && <audio src="/notification-sound.mp3" autoPlay onEnded={() => setPlaySound(false)} />}
        </motion.div>
    )
}

export default TrackOrderPage

