import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  InputAdornment, 
  IconButton,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  Facebook,
  Google,
  Apple
} from '@mui/icons-material';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import foodDeliveryImage from '../assets/peakpx.jpg'; // Add this image to your assets
import logo from '../assets/foodfetchword2.png'; // Add this image to your assets
import { useAuth } from '../context/AuthContext';

const LoginSignUpPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  // State for managing tab selection (login/signup)
  const [tabValue, setTabValue] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    rememberMe: false
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form validation and error state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Additional validations for signup
    if (tabValue === 1) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      if (tabValue === 0) {
        // Login
        await login(formData.email, formData.password);
        setSubmitSuccess('Login successful!');
      } else {
        // Signup
        await signup(formData.name, formData.email, formData.password);
        setSubmitSuccess('Account created successfully!');
      }
      
      // Store "remember me" preference if needed
      if (formData.rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setSubmitError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Social login handlers
  const handleSocialLogin = (provider) => {
    // In a real app, you would implement social login logic here
    // For now, just show a message
    setSubmitError(`${provider} login is not implemented in this demo.`);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Image Section - Hidden on mobile */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${foodDeliveryImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1
            }}
          />
          
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              p: 4,
              textAlign: 'center',
              color: 'white'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                Delicious Food
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, maxWidth: 400, mx: 'auto' }}>
                Join thousands of satisfied customers enjoying meals from their favorite restaurants,
                delivered right to their doorstep.
              </Typography>
            </motion.div>
          </Box>
        </Box>
      )}
      
      {/* Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 450 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2
            }}
          >
            {/* App logo/name */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <NavLink to="/" className="flex justify-center items-center h-full">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="foodfetch"
                  className="h-14 object-contain"
                />
              </NavLink>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 ? 'Sign in to your account' : 'Create a new account'}
              </Typography>
            </Box>
            
            {/* Success/Error alerts */}
            {submitSuccess && (
              <Alert 
                severity="success" 
                sx={{ mb: 2 }}
                onClose={() => setSubmitSuccess('')}
              >
                {submitSuccess}
              </Alert>
            )}
            
            {submitError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setSubmitError('')}
              >
                {submitError}
              </Alert>
            )}
            
            {/* Tabs for switching between login and signup */}
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ mb: 3 }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
            
            <form onSubmit={handleSubmit}>
              {/* Signup fields - only show on signup tab */}
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              )}
              
              {/* Email field */}
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />
              
              {/* Password field */}
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />
              
              {/* Confirm Password - only show on signup tab */}
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={loading}
                />
              )}
              
              {/* Remember me & Forgot password - only show on login tab */}
              {tabValue === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        size="small"
                        disabled={loading}
                      />
                    }
                    label={<Typography variant="body2">Remember me</Typography>}
                  />
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary">
                      Forgot password?
                    </Typography>
                  </Link>
                </Box>
              )}
              
              {/* Submit button */}
              <motion.div whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, mb: 2, py: 1.2 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    tabValue === 0 ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </motion.div>
              
              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                  OR
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              
              {/* Social login buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <motion.div whileHover={{ scale: loading ? 1 : 1.1 }} whileTap={{ scale: loading ? 1 : 0.9 }}>
                  <IconButton 
                    sx={{ 
                      bgcolor: '#4267B2', 
                      color: 'white',
                      '&:hover': { bgcolor: '#365899' }
                    }}
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={loading}
                  >
                    <Facebook />
                  </IconButton>
                </motion.div>
                
                <motion.div whileHover={{ scale: loading ? 1 : 1.1 }} whileTap={{ scale: loading ? 1 : 0.9 }}>
                  <IconButton 
                    sx={{ 
                      bgcolor: '#DB4437', 
                      color: 'white',
                      '&:hover': { bgcolor: '#C53929' }
                    }}
                    onClick={() => handleSocialLogin('Google')}
                    disabled={loading}
                  >
                    <Google />
                  </IconButton>
                </motion.div>
                
                <motion.div whileHover={{ scale: loading ? 1 : 1.1 }} whileTap={{ scale: loading ? 1 : 0.9 }}>
                  <IconButton 
                    sx={{ 
                      bgcolor: '#000000', 
                      color: 'white',
                      '&:hover': { bgcolor: '#333333' }
                    }}
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={loading}
                  >
                    <Apple />
                  </IconButton>
                </motion.div>
              </Box>
              
              {/* Alternative action link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {tabValue === 0 ? "Don't have an account? " : "Already have an account? "}
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
                  >
                    {tabValue === 0 ? "Sign Up" : "Login"}
                  </Typography>
                </Typography>
              </Box>
            </form>
          </Paper>
          
          {/* Terms and conditions note */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              By signing in or creating an account, you agree to our{' '}
              <Link to="/terms" style={{ color: theme.palette.primary.main }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: theme.palette.primary.main }}>
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginSignUpPage;