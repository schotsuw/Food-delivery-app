import { useState } from 'react';
import { ShoppingCart, Person } from '@mui/icons-material';
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Badge,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo2.png';
import CartPopup from '../Popup/CartPopup';
import { ButtonAnimate } from './ButtonUnique/ButtonAnimate';
import { motion } from "framer-motion";
import { CartButton } from './ButtonUnique/CartButton';
const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Big Mac', price: 5.99, quantity: 2 },
    { id: 2, name: 'French Fries', price: 2.99, quantity: 2 },
    { id: 3, name: 'Coca Cola', price: 1.99, quantity: 2 },
  ]);

  const buttonToggleClass = ({ isActive }) =>
    isActive
      ? "!bg-red-500 !text-white !rounded-full !underline hover:bg-red-200"
      : "!rounded-full !underline hover:bg-red-200";
  
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
        { path: "/track-order", label: "Track Order" },
      ].map(({ path, label }) => (
        <NavLink key={path} to={path} className={({ isActive }) => buttonToggleClass({ isActive })}>
          {({ isActive }) => (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="inline-block"
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
      ))}
    </nav>

          <div className="flex items-center gap-4">
          <CartButton
              totalItems={totalItems}
              totalPrice={totalPrice}
              handleCartToggle={handleCartToggle}
            />
            <NavLink to="/login-signup">
              <ButtonAnimate startIcon={<Person />}>
                Login-SignUp
              </ButtonAnimate>
            </NavLink>
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
}

export default Navbar;