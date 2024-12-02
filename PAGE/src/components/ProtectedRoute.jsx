import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return !!localStorage.getItem('token');  // Check if token exists
  };

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for token
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
