import { useState } from 'react';
import { ShoppingCart, Person, AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import { 
  AppBar, Toolbar, Button, Badge, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import CartPopup from '../Popup/CartPopup';
import { ButtonAnimate } from './ButtonUnique/ButtonAnimate';
import { motion } from "framer-motion";
import { CartButton } from './ButtonUnique/CartButton';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Big Mac', price: 5.99, quantity: 2 },
    { id: 2, name: 'French Fries', price: 2.99, quantity: 2 },
    { id: 3, name: 'Coca Cola', price: 1.99, quantity: 2 },
  ]);
  const { hasActiveOrders, currentOrderId } = useOrder();
  const { currentUser, logout, isAuthenticated, getUserInitial } = useAuth(); // Access auth context
  const navigate = useNavigate();

  // Add state for user menu
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchor);
  
  const buttonToggleClass = ({ isActive }) =>
    isActive
      ? "!bg-red-500 !text-white !rounded-full !underline hover:bg-red-200 cursor-pointer"
      : "!rounded-full !underline cursor-pointer";
  
  const variantToggleClass = ({ isActive }) => (isActive ? "contained" : "");
  
  const buttonVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3, ease: "easeInOut" } },
    tap: { scale: 0.95 },
  };
  
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleTrackOrderClick = () => {
    if (hasActiveOrders() && currentOrderId) {
      navigate(`/track-order/${currentOrderId}`);
    } else {
      navigate('/no-active-orders');
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };


  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar className="justify-between">
          <NavLink to="/">
            <img
              src={logo || "/placeholder.svg"}
              alt="foodfetch"
              className="h-16 object-contain"
            />
          </NavLink>
          <nav className="flex gap-4">
            {[
              { path: "/", label: "Home" },
              { path: "/restaurant", label: "Restaurants" },
              { path: "/special", label: "Special Offers" },
              // Handle Track Order differently
              { path: "#", label: "Track Order", onClick: handleTrackOrderClick }
            ].map(({ path, label, onClick }) => (
              <div key={label}>
                {onClick ? (
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-block cursor-pointer"
                  >
                    <Button
                      variant="text"
                      className={buttonToggleClass({ isActive: false })}
                      onClick={onClick}
                    >
                      {label}
                    </Button>
                  </motion.div>
                ) : (
                  <NavLink key={path} to={path} className={({ isActive }) => buttonToggleClass({ isActive }) }>
                    {({ isActive }) => (
                      <motion.div
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="inline-block cursor-pointer"
                      >
                        <Button
                          variant={variantToggleClass({ isActive })}
                          className={buttonToggleClass({ isActive })}
                        >
                          {label}
                        </Button>
                      </motion.div>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <CartButton
              totalItems={totalItems}
              totalPrice={totalPrice}
              handleCartToggle={handleCartToggle}
            />
            {/* Conditional rendering based on authentication status */}
            {isAuthenticated() ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleUserMenuOpen}
                    color="inherit"
                    startIcon={
                      <Avatar 
                        sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                      >
                        {getUserInitial()}
                      </Avatar>
                    }
                  >
                    {currentUser?.name || 'User'}
                  </Button>
                </motion.div>
            {/* User dropdown menu */}
            <Menu
                  anchorEl={userMenuAnchor}
                  open={userMenuOpen}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: '200px', borderRadius: '12px', mt: 1 }
                  }}
                >
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Profile</ListItemText>
                  </MenuItem>
                  
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/orders-history'); }}>
                    <ListItemIcon>
                      <ShoppingCart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Order History</ListItemText>
                  </MenuItem>
                  
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/settings'); }}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <NavLink to="/login-signup">
                <ButtonAnimate startIcon={<Person />}>
                  Login-SignUp
                </ButtonAnimate>
              </NavLink>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <CartPopup
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </>
  );
};

export default Navbar;