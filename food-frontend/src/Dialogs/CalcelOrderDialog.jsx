import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, TextField, FormControl, 
  RadioGroup, FormControlLabel, Radio, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useOrder } from '../context/OrderContext';

const CancelOrderDialog = ({ open, onClose, orderId }) => {
  const { cancelOrder } = useOrder();
  const navigate = useNavigate(); // Add this line to get the navigate function
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCancel = () => {
    // Reset form state
    setReason('');
    setOtherReason('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Validate form
      if (!reason) {
        setError('Please select a reason for cancellation');
        setIsSubmitting(false);
        return;
      }

      if (reason === 'other' && !otherReason.trim()) {
        setError('Please provide details for your cancellation reason');
        setIsSubmitting(false);
        return;
      }

      // Get the final reason text
      const finalReason = reason === 'other' ? otherReason : reason;

      // Call the context function to cancel the order
      await cancelOrder(orderId, finalReason);
      
      // Show success message briefly before closing
      setSuccess(true);
      setTimeout(() => {
        handleCancel();
        // Add navigation to redirect the user to the no-active-orders page
        navigate('/no-active-orders');
      }, 2000);
    } catch (err) {
      setError('Failed to cancel the order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? null : handleCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Cancel Your Order</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your order has been successfully cancelled.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Please note that cancellations may incur a fee if the restaurant has already started preparing your food.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="subtitle1" gutterBottom>
              Please select a reason for cancellation:
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
              <RadioGroup
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <FormControlLabel 
                  value="Long wait time" 
                  control={<Radio />} 
                  label="Wait time is too long" 
                />
                <FormControlLabel 
                  value="Changed my mind" 
                  control={<Radio />} 
                  label="Changed my mind about the order" 
                />
                <FormControlLabel 
                  value="Ordered by mistake" 
                  control={<Radio />} 
                  label="Ordered by mistake" 
                />
                <FormControlLabel 
                  value="other" 
                  control={<Radio />} 
                  label="Other reason" 
                />
              </RadioGroup>
            </FormControl>
            
            {reason === 'other' && (
              <TextField
                label="Please specify"
                multiline
                rows={3}
                fullWidth
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                variant="outlined"
                disabled={isSubmitting}
              />
            )}
          </>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions>
          <Button 
            onClick={handleCancel} 
            color="primary"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="error" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CancelOrderDialog;