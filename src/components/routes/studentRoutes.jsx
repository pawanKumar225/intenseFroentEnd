// src/routes/studentRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import UserLogin from "../user/userLogin";
import UserRegister from "../user/Registration";
import StudentFirstTimePasswordChange from '../user/FirstTimePasswordChange';
import StudentDashboard from '../user/StudentDashboard';
import ProtectedRoute from "../../components/ProtectedRoute";

const StudentRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('studentToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Routes>
      {/* Public Routes - accessible without login */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      
      {/* Protected Routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/first-time-password" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentFirstTimePasswordChange />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirects */}
      <Route path="/" element={
        isAuthenticated ? 
        <Navigate to="/user/dashboard" replace /> : 
        <Navigate to="/user/login" replace />
      } />
      
      {/* Catch all - redirect based on auth state */}
      <Route path="*" element={
        isAuthenticated ? 
        <Navigate to="/user/dashboard" replace /> : 
        <Navigate to="/user/login" replace />
      } />
    </Routes>
  );
};

export default StudentRoutes;