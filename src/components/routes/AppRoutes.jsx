// src/routes/AppRoutes.jsx (Clean version using separate route files)
import { Routes, Route , Navigate} from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import ServiceDetail from "../pages/ServiceDetail";
import StudentRoutes from "./studentRoutes";
import AdminRoutes from "./adminRoutes";
import HRLayout from "../hrmodule/HRLayout";
import HRDashboard from "../hrmodule/HRDashboard";
import HRModule from "../hrmodule/HRModule";
import ChangePassword from "../admin/ChangePassword";
import ProtectedRoute from "../../components/ProtectedRoute";
import EmployeeLayout from "../employee/EmployeeLayout";
import EmployeeDashboard from "../employee/EmployeeDashboard";
import EmployeeAttendance from "../employee/EmployeeAttendance";
import EmployeeLeave from "../employee/EmployeeLeave";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services/:serviceId" element={<ServiceDetail />} />
      
      {/* Student Module Routes */}
       <Route path="/user/*" element={<StudentRoutes />} />
      
      {/* Admin Module Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* HR Module Routes */}
      <Route path="/hr" element={<ProtectedRoute allowedRoles={['hr_manager', 'super_admin', 'admin']}><HRLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/hr/dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="module" element={<HRModule />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* Employee Module Routes */}
      <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee', 'hr_manager', 'super_admin', 'admin']}><EmployeeLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="apply-leave" element={<EmployeeLeave />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      
      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}