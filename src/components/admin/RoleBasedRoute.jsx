// src/components/admin/RoleBasedRoute.jsx
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const user = adminAPI.getCurrentAdmin();
  const isAuthenticated = adminAPI.isLoggedIn();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};