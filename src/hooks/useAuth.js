import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token, user]);

  const login = async (credentials) => {
    setLoading(true);
    const result = await authAPI.login(credentials);
    
    if (result?.ok) {
      // Check if 2FA is required (your Django API returns requires_2fa in the data)
      if (result.data.requires_2fa) {
        setLoading(false);
        return { 
          success: false, 
          requires_2fa: true,
          message: '2FA token required'
        };
      }
      
      setToken(result.data.access);
      localStorage.setItem('token', result.data.access);
      localStorage.setItem('userData', JSON.stringify(result.data.user));
      setUser(result.data.user);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { 
        success: false, 
        message: result?.data?.error || 'Invalid credentials' 
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const result = await authAPI.register(userData);
    
    console.log('Register API result:', result);
    
    if (result?.ok) {
      setLoading(false);
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
      
      setLoading(false);
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
    loading,
    login,
    register,
    logout,
  };
};