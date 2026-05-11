// src/routes/adminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../admin/AdminLogin";
import AdminLayout from "../admin/AdminLayout";
import StudentList from "../admin/StudentList";
import PaymentHistory from "../admin/PaymentHistory";
import CreatUser from "../admin/CreateAdmin";
import ChangePassword from "../admin/ChangePassword";
import AdminDashboard from "../admin/AdminDashboard";
import ProtectedRoute from "../../components/ProtectedRoute";
import FirstTimePasswordChange from '../admin/FirstTimePasswordChange';
import HRModule from "../hrmodule/HRModule";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/first-time-password" element={<FirstTimePasswordChange />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr_manager']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="hr" element={<HRModule />} />
        <Route path="createuser" element={<CreatUser />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;