

// // src/components/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   // Get token from localStorage
//   const token = localStorage.getItem('studentToken') || localStorage.getItem('adminToken');
  
//   // If no token, redirect to login
//   if (!token) {
//     console.log('No token found, redirecting to login');
//     return <Navigate to="/user/login" replace />;
//   }
  
//   try {
//     // Decode token to check expiration and role
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
    
//     // Check if token is expired
//     if (decoded.exp < currentTime) {
//       console.log('Token expired, redirecting to login');
//       localStorage.clear();
//       return <Navigate to="/user/login" replace />;
//     }
    
//     // Check if user has required role
//     const userRole = decoded.role || decoded.type;
//     if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
//       console.log('Unauthorized role, redirecting to login');
//       return <Navigate to="/user/login" replace />;
//     }
    
//     // Token is valid, render children
//     return children;
    
//   } catch (error) {
//     console.error('Token decode error:', error);
//     localStorage.clear();
//     return <Navigate to="/user/login" replace />;
//   }
// };

// export default ProtectedRoute;


// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isFirstTimeLogin = localStorage.getItem('isFirstTimeLogin') === 'true';
  const isOnFirstTimePasswordPage = location.pathname.includes('first-time-password');
  
  // Not authenticated
  if (!token) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/hr')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/employee')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  // First time login - must change password
  if (isFirstTimeLogin && !isOnFirstTimePasswordPage) {
    return <Navigate to="/admin/first-time-password" replace />;
  }
  
  // Already changed password but trying to access first-time page
  if (!isFirstTimeLogin && isOnFirstTimePasswordPage) {
    // Redirect based on role
    if (userRole === 'hr_manager') {
      return <Navigate to="/hr/dashboard" replace />;
    }
    if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === 'hr_manager') {
      return <Navigate to="/hr/dashboard" replace />;
    }
    if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;