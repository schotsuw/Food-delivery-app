// src/Dialogs/PaymentDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Divider,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import OrderConfirmation from '../components/OrderConfirmation';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';

const PaymentDialog = ({ open, onClose, total, cartItems }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { createOrder, confirmPayment } = useOrder();

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [order, setOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
    else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, '')))
      newErrors.cardNumber = 'Enter a valid 16-digit card number';

    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate))
      newErrors.expiryDate = 'Use format MM/YY';

    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) newErrors.cvv = 'Invalid CVV';

    if (!paymentInfo.cardholderName) newErrors.cardholderName = 'Cardholder name is required';

    if (!paymentInfo.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(paymentInfo.email)) newErrors.email = 'Enter a valid email';

    if (!paymentInfo.address) newErrors.address = 'Delivery address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      // Calculate order details
      const tax = total * 0.08; // 8% tax
      const deliveryFee = 2.99;
      const orderTotal = total + tax + deliveryFee;

      // Get restaurant name from the first item
      const restaurantName = cartItems[0]?.restaurantName || 'Restaurant';

      // Prepare order data
      const orderData = {
        items: cartItems,
        subtotal: total,
        tax: tax,
        deliveryFee: deliveryFee,
        total: orderTotal,
        status: 'CONFIRMED',
        paymentMethod: 'CREDIT_CARD',
        deliveryAddress: paymentInfo.address,
        customerEmail: paymentInfo.email,
        restaurantName: restaurantName,
        // We'd normally get this from the restaurant data
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString()
      };

      // Create the order using our order service
      const createdOrder = await createOrder(orderData);

      // Set the created order
      setOrder(createdOrder);
      setOrderCompleted(true);

      // We'll handle navigation in the order confirmation component
      // No need to call confirmPayment here

    } catch (error) {
      console.error('Error processing payment:', error);
      setErrorMessage('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirmationClose = () => {
    setOrderCompleted(false);
    onClose();
    clearCart();
  };

  const handleTrackOrder = () => {
    if (order && order.orderId) {
      setOrderCompleted(false);
      onClose();
      clearCart();
      navigate(`/track-order/${order.orderId}`);
    }
  };

  // If order is completed, show order confirmation
  if (orderCompleted) {
    return (
        <OrderConfirmation
            open={open}
            onClose={handleOrderConfirmationClose}
            order={order}
            clearCart={clearCart}
            onTrackOrder={handleTrackOrder}
        />
    );
  }

  return (
      <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>

        <DialogContent>
          {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
          )}

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="body1">Subtotal</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1" align="right">${total.toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body1">Tax (8%)</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1" align="right">${(total * 0.08).toFixed(2)}</Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body1">Delivery Fee</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1" align="right">$2.99</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6" align="right" fontWeight="bold">
                  ${(total + (total * 0.08) + 2.99).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                  name="cardholderName"
                  label="Cardholder Name"
                  value={paymentInfo.cardholderName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.cardholderName}
                  helperText={errors.cardholderName}
                  disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                  name="cardNumber"
                  label="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  fullWidth
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  disabled={loading}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  value={paymentInfo.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  fullWidth
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                  disabled={loading}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                  name="cvv"
                  label="CVV"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  type="password"
                  fullWidth
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                  name="email"
                  label="Email Address"
                  value={paymentInfo.email}
                  onChange={handleChange}
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                  name="address"
                  label="Delivery Address"
                  value={paymentInfo.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address}
                  disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
              onClick={onClose}
              color="inherit"
              disabled={loading}
          >
            Cancel
          </Button>
          <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Processing...' : `Pay $${(total + (total * 0.08) + 2.99).toFixed(2)}`}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default PaymentDialog;