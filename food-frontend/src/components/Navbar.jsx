// src/components/Navbar.jsx
import { useState } from 'react';
import {
  ShoppingCart,
  Person,
  AccountCircle,
  ExitToApp,
  Settings,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import CartPopup from '../Popup/CartPopup';
import { ButtonAnimate } from './ButtonUnique/ButtonAnimate';
import { motion } from "framer-motion";
import { CartButton } from './ButtonUnique/CartButton';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  // Use cart context
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const { hasActiveOrders, currentOrderId } = useOrder();
  const { currentUser, logout, isAuthenticated, getUserInitial } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User menu state
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
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleTrackOrderClick = () => {
    if (hasActiveOrders() && currentOrderId) {
      navigate(`/track-order/${currentOrderId}`);
    } else {
      navigate('/no-active-orders');
    }
    if (mobileMenuOpen) setMobileMenuOpen(false);
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
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/restaurant", label: "Restaurants" },
    { path: "/special", label: "Special Offers" },
    { path: "#", label: "Track Order", onClick: handleTrackOrderClick }
  ];

  // Mobile menu drawer component
  const mobileMenuDrawer = (
      <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: { width: '70%', maxWidth: '300px' }
          }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box
                component={NavLink}
                to="/"
                onClick={() => setMobileMenuOpen(false)}
            >
              <img
                  src={logo || "/placeholder.svg"}
                  alt="foodfetch"
                  className="h-10 object-contain"
              />
            </Box>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Nav links */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {navLinks.map((link) => (
                <Button
                    key={link.label}
                    component={link.onClick ? 'button' : NavLink}
                    to={link.onClick ? undefined : link.path}
                    onClick={link.onClick || (() => setMobileMenuOpen(false))}
                    variant="text"
                    sx={{
                      justifyContent: 'flex-start',
                      fontWeight: 500,
                      py: 1
                    }}
                >
                  {link.label}
                </Button>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Cart button in mobile menu */}
          <Box sx={{ mb: 2 }}>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleCartToggle}
                sx={{ mb: 1 }}
            >
              Cart (${totalPrice.toFixed(2)})
            </Button>
          </Box>

          {/* User menu in mobile drawer */}
          {isAuthenticated() ? (
              <Box>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<AccountCircle />}
                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                    sx={{ mb: 1 }}
                >
                  My Profile
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => { navigate('/orders-history'); setMobileMenuOpen(false); }}
                    sx={{ mb: 1 }}
                >
                  Order History
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Settings />}
                    onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
                    sx={{ mb: 1 }}
                >
                  Settings
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
          ) : (
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Person />}
                  component={NavLink}
                  to="/login-signup"
                  onClick={() => setMobileMenuOpen(false)}
              >
                Login-SignUp
              </Button>
          )}
        </Box>
      </Drawer>
  );

  return (
      <>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar className="justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                  src={logo || "/placeholder.svg"}
                  alt="foodfetch"
                  className="h-16 object-contain"
              />
            </NavLink>

            {/* Desktop Navigation */}
            {!isMobile && (
                <nav className="flex gap-4">
                  {navLinks.map((link) => (
                      <div key={link.label}>
                        {link.onClick ? (
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
                                  onClick={link.onClick}
                              >
                                {link.label}
                              </Button>
                            </motion.div>
                        ) : (
                            <NavLink key={link.path} to={link.path} className={({ isActive }) => buttonToggleClass({ isActive })}>
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
                                      {link.label}
                                    </Button>
                                  </motion.div>
                              )}
                            </NavLink>
                        )}
                      </div>
                  ))}
                </nav>
            )}

            {/* Right Side: Cart and User */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Show cart button on all devices */}
              <div className="hidden sm:block">
                <CartButton
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    handleCartToggle={handleCartToggle}
                />
              </div>

              {/* Show simple cart icon on mobile */}
              <div className="sm:hidden">
                <IconButton color="primary" onClick={handleCartToggle}>
                  <Badge badgeContent={totalItems} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </div>

              {/* Desktop: Show login button or user profile */}
              {!isMobile && (
                  <>
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
                  </>
              )}

              {/* Mobile menu toggle button */}
              {isMobile && (
                  <IconButton
                      edge="end"
                      color="inherit"
                      aria-label="menu"
                      onClick={toggleMobileMenu}
                  >
                    <MenuIcon />
                  </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>

        {/* Mobile menu drawer */}
        {mobileMenuDrawer}

        {/* Cart popup */}
        <CartPopup
            open={isCartOpen}
            onClose={() => setIsCartOpen(false)}
        />
      </>
  );
};

export default Navbar;