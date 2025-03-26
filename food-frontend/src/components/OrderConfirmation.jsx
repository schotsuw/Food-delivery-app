// src/components/OrderConfirmation.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip
} from '@mui/material';
import { CheckCircle, AccessTime, RestaurantMenu, Moped } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ open, onClose, order, clearCart, onTrackOrder }) => {
    const navigate = useNavigate();

    if (!order) return null;

    // Get orderId from order.orderId or order.id, whichever is available
    const orderId = order.orderId || order.id || `ORD-${Math.floor(Math.random() * 10000)}`;

    // Generate estimated delivery time (30-45 minutes from now)
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (30 + Math.floor(Math.random() * 15)) * 60000);
    const formattedDeliveryTime = deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle view order button - use the provided onTrackOrder function or navigate directly
    const handleViewOrder = () => {
        if (onTrackOrder) {
            onTrackOrder();
        } else {
            onClose();
            clearCart();
            navigate(`/track-order/${orderId}`);
        }
    };

    const handleClose = () => {
        onClose();
        clearCart();
        navigate('/');
    };

    // Safety check for required properties
    const restaurantName = order.restaurantName || "Restaurant";
    const email = order.customerEmail || order.email || "your email";
    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : 0;
    const tax = typeof order.tax === 'number' ? order.tax : 0;
    const deliveryFee = typeof order.deliveryFee === 'number' ? order.deliveryFee : 2.99;
    const total = typeof order.total === 'number' ? order.total : (subtotal + tax + deliveryFee);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle color="success" />
                    <Typography variant="h6">Order Confirmed!</Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" paragraph>
                    Thank you for your order. We've received your payment and your food is being prepared!
                </Typography>

                <Box my={3} p={2} sx={{ backgroundColor: 'success.light', borderRadius: 2, color: 'white' }}>
                    <Typography variant="h5" gutterBottom textAlign="center">
                        Order #{orderId}
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={3} mt={2}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <AccessTime />
                            <Typography variant="body2" mt={1}>
                                Est. Delivery
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {formattedDeliveryTime}
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <RestaurantMenu />
                            <Typography variant="body2" mt={1}>
                                Restaurant
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                {restaurantName}
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Moped />
                            <Typography variant="body2" mt={1}>
                                Status
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                Preparing
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Order Summary
                </Typography>

                <List>
                    {order.items && order.items.map((item, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body1">{item.name}</Typography>
                                        {item.quantity > 1 && (
                                            <Chip
                                                label={`x${item.quantity}`}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={`$${(item.price * (item.quantity || 1)).toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Box mt={2}>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="subtitle1">Subtotal</Typography>
                        <Typography variant="subtitle1">${subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="subtitle1">Delivery Fee</Typography>
                        <Typography variant="subtitle1">${deliveryFee.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={1} mb={2}>
                        <Typography variant="subtitle1">Tax</Typography>
                        <Typography variant="subtitle1">${tax.toFixed(2)}</Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="h6">Total</Typography>
                        <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                    </Box>
                </Box>

                <Box mt={3} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2">
                        We'll send updates about your order to <strong>{email}</strong>.
                        You can also track your order status in real-time.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={handleClose} color="inherit">
                    Continue Shopping
                </Button>
                <Button onClick={handleViewOrder} variant="contained" color="primary">
                    Track Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderConfirmation;