import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);       // Only for initialization
  const [loginLoading, setLoginLoading] = useState(false); // Only for login action

  // Fetch user data on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        
        try {
          // Try to fetch fresh user data from server
          const result = await authAPI.getCurrentUser();
          
          if (result?.ok) {
            setUser(result.data);
            localStorage.setItem('userData', JSON.stringify(result.data));
          } else {
            // Token is invalid, clear everything
            console.error('Failed to fetch user data:', result);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          // On error, try to use cached data as fallback
          const cachedUserData = localStorage.getItem('userData');
          if (cachedUserData) {
            setUser(JSON.parse(cachedUserData));
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoginLoading(true); // ← use loginLoading, NOT loading
    const result = await authAPI.login(credentials);
    
    console.log('🔵 LOGIN API RESULT:', result);
    console.log('🔴 RAW API RESULT:', JSON.stringify(result));
    
    if (result?.ok) {
      // Check if 2FA is required
      if (result.data.requires_2fa) {
        console.log('✅ 2FA is required');
        setLoginLoading(false);
        return { 
          success: false, 
          requires_2fa: true,
          message: '2FA token required'
        };
      }
      
      // Check if we got tokens (successful login)
      if (result.data.access && result.data.user) {
        console.log('✅ Login successful with tokens');
        setToken(result.data.access);
        localStorage.setItem('token', result.data.access);
        localStorage.setItem('userData', JSON.stringify(result.data.user));
        setUser(result.data.user);
        setLoginLoading(false);
        return { success: true };
      }
      
      // If we get here, unexpected response
      console.error('❌ Unexpected response format:', result.data);
      setLoginLoading(false);
      return { 
        success: false, 
        message: 'Unexpected response from server' 
      };
    } else {
      // Login failed
      console.error('❌ Login failed:', result);
      setLoginLoading(false);
      return { 
        success: false, 
        message: result?.data?.error || 'Invalid credentials' 
      };
    }
  };

  const register = async (userData) => {
    const result = await authAPI.register(userData);
    
    console.log('Register API result:', result);
    
    if (result?.ok) {
      return { success: true };
    } else {
      let errorMessage = 'Registration failed';
      
      if (result?.data) {
        if (result.data.error) {
          errorMessage = result.data.error;
        } else if (result.data.username) {
          errorMessage = result.data.username[0];
        } else if (result.data.email) {
          errorMessage = result.data.email[0];
        } else if (result.data.password) {
          errorMessage = result.data.password[0];
        } else if (result.data.non_field_errors) {
          errorMessage = result.data.non_field_errors[0];
        } else if (typeof result.data === 'string') {
          errorMessage = result.data;
        } else if (result.data.message) {
          errorMessage = result.data.message;
        }
      }
      
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    loading,        // true only during app initialization
    loginLoading,   // true only during login API call
    login,
    register,
    logout,
  };
};