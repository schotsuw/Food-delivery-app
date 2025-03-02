import { useState } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import PaymentDialog from "../Dialogs/PaymentDialog";

const CartPopup = ({ open, onClose, cartItems, onUpdateQuantity }) => {
  const [openPayment, setOpenPayment] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drawer content (unchanged) */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.name} secondary={`$${item.price.toFixed(2)}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="decrease"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Remove />
                  </IconButton>
                  <Typography component="span" sx={{ mx: 1 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    edge="end"
                    aria-label="increase"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Box mt={2}>
            <Divider />
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" color="primary" fullWidth onClick={() => setOpenPayment(true)}>
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Pass cartItems to PaymentDialog */}
      <PaymentDialog 
        open={openPayment} 
        onClose={() => setOpenPayment(false)} 
        total={total} 
        cartItems={cartItems}
      />
    </>
  );
};

export default CartPopup;