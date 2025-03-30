// src/Popup/CartPopup.jsx
import { useState } from "react";
import { useNavigate} from "react-router-dom";
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
  Alert
} from "@mui/material";
import { Close, Add, Remove, ShoppingCart } from "@mui/icons-material";
import PaymentDialog from "../Dialogs/PaymentDialog";
import { useCart } from "../context/CartContext";

const CartPopup = ({ open, onClose }) => {
  const [openPayment, setOpenPayment] = useState(false);
    const navigate = useNavigate();
  // Use cart context
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();

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
            {/* Drawer content */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Your Cart</Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>

            {cartItems.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Your cart is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    Add items from the menu to get started
                  </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            onClose();
                            navigate('/restaurant'); // Navigate to the restaurant listing page
                        }}>
                        Browse Restaunts
                    </Button>
                </Box>
            ) : (
                <>
                  <List>
                    {cartItems.map((item) => (
                        <ListItem key={item.id} divider>
                          <ListItemText
                              primary={item.name}
                              secondary={`$${item.price.toFixed(2)} ${item.quantity > 1 ? `x ${item.quantity}` : ''}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="decrease"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography component="span" sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                                edge="end"
                                aria-label="increase"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                      <Typography variant="subtitle1" fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={1}>
                      <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => setOpenPayment(true)}
                      >
                        Proceed to Checkout
                      </Button>
                      <Button
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                    </Box>
                  </Box>
                </>
            )}
          </Box>
        </Drawer>

        {/* Pass cartItems to PaymentDialog */}
        <PaymentDialog
            open={openPayment}
            onClose={() => setOpenPayment(false)}
            total={totalPrice}
            cartItems={cartItems}
        />
      </>
  );
};

export default CartPopup;