// src/routes/adminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import StudentApprovals from "../admin/StudentApprovals";
import AdminProfile from "../admin/AdminProfile";
import AdminLogin from "../admin/AdminLogin";
import ChangePassword from "../admin/ChangePassword";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../admin/AdminLayout";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public Admin Login - No layout needed */}
      <Route path="login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes with Layout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'hr_manager', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<StudentApprovals />} />
        <Route path="students" element={<div>Student List Page</div>} />
        <Route path="payments" element={<div>Payment History Page</div>} />
        <Route path="hr" element={<div>HR Module Page</div>} />
        <Route path="createuser" element={<div>Create User Page</div>} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      
      {/* Catch all redirect to login */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}