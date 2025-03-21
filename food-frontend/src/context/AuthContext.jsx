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
  const [authError, setAuthError] = useState(null);
  
  // Check if user was previously logged in (from localStorage)
  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (error) {
      console.error("Error restoring auth state:", error);
      // Clear potentially corrupted data
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateUserProfile = (updatedData) => {
    if (!currentUser) return null;
    
    try {
      // Create updated user object
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      setAuthError("Failed to update profile");
      return null;
    }
  };

  // Sign up function
  const signup = async (name, email, password) => {
    try {
      setAuthError(null);
      
      // For a real app, this would be an API call to your backend
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user object with additional profile data
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        profilePicture: null, // Default profile picture
        createdAt: new Date().toISOString(),
        // In a real app, you would NEVER store the password in localStorage
        // This is just for demonstration purposes
      };
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set the current user
      setCurrentUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Failed to create account");
      return null;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(null);
      
      // For a real app, this would be an API call to validate credentials
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create sample user data - in a real app, this would come from your API
      const user = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Create a name from the email for demo
        email,
        profilePicture: null,
        lastLogin: new Date().toISOString()
      };
      
      // Store the user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set the current user
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Invalid email or password");
      return null;
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Remove user from localStorage
      localStorage.removeItem('user');
      
      // Clear current user
      setCurrentUser(null);
      
      // Clear any error state
      setAuthError(null);
      
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  // Function to check if user is logged in
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  // Get user's initial (for avatar)
  const getUserInitial = () => {
    if (!currentUser || !currentUser.name) return 'U';
    return currentUser.name.charAt(0).toUpperCase();
  };

  // Context value
  const value = {
    currentUser,
    signup,
    login,
    logout,
    isAuthenticated,
    updateUserProfile,
    getUserInitial,
    authError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};