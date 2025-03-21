import LandingPage from './pages/LandingPage';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Make sure this is react-router-dom
import MainLayout from './layouts/MainLayout';
import RestaurantPage from './pages/RestaurantPage';
import SingleRestaurantPage from './pages/SingleRestaurantPage';
import TrackOrderPage from './pages/TrackOrderPage';
import SpecialOfferPage from './pages/SpecialOfferPage';
import LoginSignUpPage from './pages/LoginSignUpPage';
import LocationPopup from './Popup/LocationPopup';
import NoActiveOrdersPage from './pages/NoActiveOrdersPage';
import { OrderProvider } from './context/OrderContext'; 
import ProtectedRoute from './route/ProtectedRoute';
import { AuthProvider } from './context/AuthContext'; // Add this import

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
      <AuthProvider> 
        <BrowserRouter>
          <OrderProvider>
            <LocationPopup/>
            <div className='bg-white'></div>
            <Routes>
              <Route path='/' element={<MainLayout/>}>
                <Route index element={<LandingPage/>}/>
                <Route path='/restaurant' element={<RestaurantPage/>}/>
                <Route path='/special' element={<SpecialOfferPage/>}/>
                <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
                <Route path="/no-active-orders" element={<NoActiveOrdersPage />} />
                <Route path='/login-signup' element={<LoginSignUpPage/>}/>
                
                {/* Protected routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <div>Protected Profile Page</div>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <div>Protected Checkout Page</div>
                  </ProtectedRoute>
                } />
                {/* Add more protected routes as needed */}
              </Route>
            </Routes>
          </OrderProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App