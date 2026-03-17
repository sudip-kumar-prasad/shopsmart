import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user is saved in localStorage on load
    const savedUser = localStorage.getItem('shopsmart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      setUser(data);
      localStorage.setItem('shopsmart_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (error.response) {
        return { success: false, error: error.response.data.message };
      }
      // Fallback if backend is not running
      console.log('Backend not available, using fallback local auth login');
      const dummyUser = { _id: '1', name: 'John Doe (Local)', email, isAdmin: false, token: 'dummy_token' };
      setUser(dummyUser);
      localStorage.setItem('shopsmart_user', JSON.stringify(dummyUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopsmart_user');
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      setUser(data);
      localStorage.setItem('shopsmart_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (error.response) {
        return { success: false, error: error.response.data.message };
      }
      console.log('Backend not available, using fallback local auth register');
      const dummyUser = { _id: '2', name, email, isAdmin: false, token: 'dummy_token' };
      setUser(dummyUser);
      localStorage.setItem('shopsmart_user', JSON.stringify(dummyUser));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
