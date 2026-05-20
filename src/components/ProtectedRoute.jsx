// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Check for both token formats (admin and student)
  const adminToken = localStorage.getItem('token');
  const studentToken = localStorage.getItem('studentToken');
  const token = adminToken || studentToken;
  
  const userRole = localStorage.getItem('userRole');
  const isFirstTimeLogin = localStorage.getItem('isFirstTimeLogin') === 'true';
  const isOnFirstTimePasswordPage = location.pathname.includes('first-time-password');
  
  // Not authenticated
  if (!token) {
    // Redirect based on the attempted path
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/hr')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/employee')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/user')) {
      return <Navigate to="/user/login" state={{ from: location }} replace />;
    }
    // Default redirect for student routes
    return <Navigate to="/user/login" replace />;
  }
  
  // First time login - must change password
  if (isFirstTimeLogin && !isOnFirstTimePasswordPage) {
    // Redirect based on role
    if (userRole === 'student') {
      return <Navigate to="/user/first-time-password" replace />;
    }
    if (userRole === 'hr_manager') {
      return <Navigate to="/hr/first-time-password" replace />;
    }
    if (userRole === 'employee') {
      return <Navigate to="/employee/first-time-password" replace />;
    }
    return <Navigate to="/admin/first-time-password" replace />;
  }
  
  // Already changed password but trying to access first-time page
  if (!isFirstTimeLogin && isOnFirstTimePasswordPage) {
    // Redirect based on role
    if (userRole === 'student') {
      return <Navigate to="/user/dashboard" replace />;
    }
    if (userRole === 'hr_manager') {
      return <Navigate to="/hr/dashboard" replace />;
    }
    if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'student') {
      return <Navigate to="/user/dashboard" replace />;
    }
    if (userRole === 'hr_manager') {
      return <Navigate to="/hr/dashboard" replace />;
    }
    if (userRole === 'employee') {
      return <Navigate to="/employee/dashboard" replace />;
    }
    if (userRole === 'admin' || userRole === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;