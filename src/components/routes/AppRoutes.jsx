// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import ServiceDetail from "../pages/ServiceDetail";

// Route Modules
import StudentRoutes from "./studentRoutes";
import AdminRoutes from "./adminRoutes";

// HR Module
import HRLayout from "../hrmodule/HRLayout";
import HRDashboard from "../hrmodule/HRDashboard";
import HRModule from "../hrmodule/HRModule";

// Employee Module
import EmployeeLayout from "../employee/EmployeeLayout";
import EmployeeDashboard from "../employee/EmployeeDashboard";
import EmployeeAttendance from "../employee/EmployeeAttendance";
import EmployeeLeave from "../employee/EmployeeLeave";

// Common Components
import ChangePassword from "../admin/ChangePassword";
import StudentApprovals from "../admin/StudentApprovals";
import AdminLogin from "../admin/AdminLogin";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services/:serviceId" element={<ServiceDetail />} />

      {/* ================= STUDENT MODULE ================= */}
      <Route path="/user/*" element={<StudentRoutes />} />

      {/* ================= ADMIN MODULE ================= */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* ================= HR MODULE ================= */}
      <Route
        path="/hr"
        element={
          <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin"]}>
            <HRLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/hr/dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="module" element={<HRModule />} />
        <Route path="change-password" element={<ChangePassword />} />
        
        {/* Approvals route within HR module */}
        <Route
          path="approvals"
          element={
            <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin"]}>
              <StudentApprovals />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= EMPLOYEE MODULE ================= */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee", "hr_manager", "super_admin", "admin"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="apply-leave" element={<EmployeeLeave />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}