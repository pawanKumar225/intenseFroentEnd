

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Get token from localStorage
  const token = localStorage.getItem('studentToken') || localStorage.getItem('adminToken');
  
  // If no token, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/user/login" replace />;
  }
  
  try {
    // Decode token to check expiration and role
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      console.log('Token expired, redirecting to login');
      localStorage.clear();
      return <Navigate to="/user/login" replace />;
    }
    
    // Check if user has required role
    const userRole = decoded.role || decoded.type;
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.log('Unauthorized role, redirecting to login');
      return <Navigate to="/user/login" replace />;
    }
    
    // Token is valid, render children
    return children;
    
  } catch (error) {
    console.error('Token decode error:', error);
    localStorage.clear();
    return <Navigate to="/user/login" replace />;
  }
};

export default ProtectedRoute;