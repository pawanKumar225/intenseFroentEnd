// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Simple check - returns immediately
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/user/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;