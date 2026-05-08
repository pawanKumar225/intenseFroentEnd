// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = adminAPI.isLoggedIn();
  
  if (!isLoggedIn) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;