import { ShoppingCart, Person } from '@mui/icons-material';
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Badge,
  } from '@mui/material';

import logo from '../assets/logo2.png';
import { NavLink } from 'react-router-dom'; // Corrected import

const Navbar = () => {
  const buttonToggleClass = ({ isActive }) => isActive 
  ? '!bg-red-500 !text-white !rounded-full !underline hover:bg-red-200' 
  : '!rounded-full !underline hover:bg-red-200';
  const variantToggleClass = ({ isActive }) => isActive ? 'contained' : '';

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar className="justify-between">
        <img
          src={logo}
          alt="foodfetch"
          className="h-16 object-contain"
        />
        
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" 
            className={({ isActive }) => buttonToggleClass({ isActive })}>
            {({ isActive }) => (
              <Button 
                variant={variantToggleClass({ isActive })}
                className={buttonToggleClass({ isActive })}
              >
                Home
              </Button>
            )}
          </NavLink>
          <NavLink to="/restaurant" className={({ isActive }) => buttonToggleClass({ isActive })}>
            {({ isActive }) => (
              <Button
                variant={variantToggleClass({ isActive })}
                className={buttonToggleClass({ isActive })}
              >
                Restaurants
              </Button>
            )}
          </NavLink>
          <NavLink to="/special" className={({ isActive }) => buttonToggleClass({ isActive })}>
            {({ isActive }) => (
              <Button
                variant={variantToggleClass({ isActive })}
                className={buttonToggleClass({ isActive })}
              >
                Special Offers
              </Button>
            )}
          </NavLink>
          <NavLink to="/track-order" className={({ isActive }) => buttonToggleClass({ isActive })}>
            {({ isActive }) => (
              <Button
                variant={variantToggleClass({ isActive })}
                className={buttonToggleClass({ isActive })}
              >
                Track Order
              </Button>
            )}
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <NavLink to="/cart">
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:shadow-xl cursor-pointer">
              <Badge badgeContent={23} color="error">
                <ShoppingCart />
              </Badge>
              <span>$79.89</span>
            </div>
          </NavLink>
          <NavLink to="/login-signup">
            <Button
              variant="contained"
              className="!bg-gray-900 !text-white"
              startIcon={<Person />}
            >
              Login/Signup
            </Button>
          </NavLink>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;