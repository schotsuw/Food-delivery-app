import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Typography } from "@mui/material";
import { useOrder } from "../context/OrderContext";

const PaymentDialog = ({ open, onClose, total, cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { createOrder, confirmPayment, activeOrder } = useOrder();
  
  // Clear message when dialog opens
  useEffect(() => {
    if (open) {
      setMessage("");
      setLoading(false);
    }
  }, [open]);

  // Handle dialog close with state reset
  const handleClose = () => {
    setMessage("");
    setLoading(false);
    onClose();
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create an order first
      const orderId = createOrder(cartItems, total);
      
      // Simulate API call
      setTimeout(() => {
        // For initial payment, just proceed as normal
        setMessage("Payment successful!");
        setLoading(false);
        
        // Confirm payment and redirect to tracking
        confirmPayment(orderId);
        setTimeout(() => onClose(), 1000);
      }, 1500);
    } catch (error) {
      setMessage("Payment failed!");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Choose Payment Method</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Total: <strong>${total ? total.toFixed(2) : '0.00'}</strong>
        </Typography>
        <Select 
          fullWidth 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="paypal">PayPal</MenuItem>
          <MenuItem value="card">Credit/Debit Card</MenuItem>
          <MenuItem value="bitcoin">Bitcoin</MenuItem>
        </Select>
        {message && (
          <Typography 
            variant="body1" 
            color={message.includes("successful") ? "success.main" : "error.main"} 
            mt={2}
          >
            {message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handlePayment} 
          variant="contained" 
          color="primary" 
          disabled={loading || !cartItems || cartItems.length === 0}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;