import LandingPage from './pages/LandingPage';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from './layouts/MainLayout';
import RestaurantPage from './pages/RestaurantPage';
import SingleRestaurantPage from './pages/SingleRestaurantPage';
import TrackOrderPage from './pages/TrackOrderPage';
import SpecialOfferPage from './pages/SpecialOfferPage';
import LoginSignUpPage from './pages/LoginSignUpPage';
import LocationPopup from './Popup/LocationPopup';
import NoActiveOrdersPage from './pages/NoActiveOrdersPage';
import { OrderProvider } from './context/OrderContext'; // Add this import

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  palette: {
    primary: {
      main: '#FF3A2F',
    },
    secondary: {
      main: '#0F172A',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <OrderProvider> {/* Add OrderProvider here */}
          <LocationPopup />
          <div className='bg-white'></div>
          <Routes>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path='/restaurant' element={<RestaurantPage />} />
              <Route path='/restaurant/:restaurantSlug' element={<SingleRestaurantPage />} />
              <Route path='/special' element={<SpecialOfferPage />} />
              <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
              <Route path="/no-active-orders" element={<NoActiveOrdersPage />} />
              <Route path='/login-signup' element={<LoginSignUpPage />} />
            </Route>
          </Routes>
        </OrderProvider> {/* Close OrderProvider */}
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App