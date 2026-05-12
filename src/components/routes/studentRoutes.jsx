// src/routes/studentRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "../user/userLogin";
import UserRegister from "../user/Register";
import StudentFirstTimePasswordChange from '../user/FirstTimePasswordChange';
import StudentDashboard from '../user/StudentDashboard';
import ProtectedRoute from "../../components/ProtectedRoute";

const StudentRoutes = () => {
  // Get token to check if user is logged in
  const token = localStorage.getItem('studentToken');
  const isAuthenticated = !!token;

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