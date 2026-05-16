// src/routes/adminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import StudentApprovals from "../admin/StudentApprovals";
import AdminProfile from "../admin/AdminProfile";
import AdminLogin from "../admin/AdminLogin";
import ChangePassword from "../admin/ChangePassword";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../admin/AdminLayout";
import StudentList from '../admin/StudentList';
import PaymentHistory from '../admin/PaymentHistory';
import CreateAdmin from '../admin/CreateAdmin';
import HRModule from "../hrmodule/HRModule";
import FirstTimePasswordChange from '../admin/AdminFirstTimePasswordChange';

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public Admin Login - No layout needed */}
      <Route path="login" element={<AdminLogin />} />
      {/* First Time Password Change - Requires token but no layout */}
      <Route path="first-time-password" element={<FirstTimePasswordChange />} />
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
        <Route path="students" element={<StudentList />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="hr" element={<HRModule />} />
        <Route path="createuser" element={<CreateAdmin />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      
      {/* Catch all redirect to login */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}