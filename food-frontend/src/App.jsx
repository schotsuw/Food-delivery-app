import LandingPage from './pages/LandingPage';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
// import ExclusiveDeals from './components/ExclusiveDeals';
// import PopularRestaurants from './components/PopularRestaurant';
// import AboutSection from './components/AboutSection';
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from './layouts/MainLayout';
import RestaurantPage from './pages/RestaurantPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CartPage from './pages/CartPage';
import SpecialOfferPage from './pages/SpecialOfferPage';
import LoginSignUpPage from './pages/LoginSignUpPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF3A2F', 
    },
    secondary: {
      main: '#0F172A', 
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
    },
  },
});


const App = () => {
  return (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<MainLayout/>}>
            <Route index element={<LandingPage/>}/>
            <Route path='/restaurant' element={<RestaurantPage/>}/>
            <Route path='/special' element={<SpecialOfferPage/>}/>
            <Route path='/track-order' element={<TrackOrderPage/>}/>
            <Route path='/cart' element={<CartPage/>}/>
            <Route path='/login-signup' element={<LoginSignUpPage/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  )
}

export default App
