import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user was previously logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = async (name, email, password) => {
    // For a real app, this would be an API call to your backend
    // For this simple example, we'll just simulate a successful signup
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new user object
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      // In a real app, you would NEVER store the password in localStorage
      // This is just for demonstration purposes
    };
    
    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Set the current user
    setCurrentUser(newUser);
    
    return newUser;
  };

  // Login function
  const login = async (email, password) => {
    // For a real app, this would be an API call to validate credentials
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, let's just pretend any login is successful
    // In a real app, you would validate credentials against your backend
    
    const user = {
      id: Date.now().toString(),
      name: 'Demo User', // In a real app, you'd get this from your API
      email
    };
    
    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set the current user
    setCurrentUser(user);
    
    return user;
  };

  // Logout function
  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // Clear current user
    setCurrentUser(null);
  };

  // Function to check if user is logged in
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Context value
  const value = {
    currentUser,
    signup,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};