import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on page load
    const token = localStorage.getItem('fintrack_token');
    if (token) {
      // In a real app, you might want to verify the token with a /me endpoint here
      setUser({ token });
    }
    setLoading(false);
  }, []);

const login = async (email, password) => {
    try {
      // 🚨 THE REAL BACKEND CALL 🚨
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('fintrack_token', token);
      setUser({ token });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      // If the backend sends our new ErrorResponse, we can display it!
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};