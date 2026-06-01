// // src/routes/AppRoutes.jsx
// import { Routes, Route, Navigate } from "react-router-dom";

// // Public Pages
// import Home from "../pages/Home";
// import About from "../pages/About";
// import Services from "../pages/Services";
// import Contact from "../pages/Contact";
// import ServiceDetail from "../pages/ServiceDetail";

// // Route Modules
// import StudentRoutes from "./studentRoutes";
// import AdminRoutes from "./adminRoutes";

// // HR Module
// import HRLayout from "../hrmodule/HRLayout";
// import HRDashboard from "../hrmodule/HRDashboard";
// import HRModule from "../hrmodule/HRModule";

// // Employee Module
// import EmployeeLayout from "../employee/EmployeeLayout";
// import EmployeeDashboard from "../employee/EmployeeDashboard";
// import EmployeeAttendance from "../employee/EmployeeAttendance";
// import EmployeeLeave from "../employee/EmployeeLeave";

// // Common Components
// import ChangePassword from "../admin/ChangePassword";
// import StudentApprovals from "../admin/StudentApprovals";
// import AdminLogin from "../admin/AdminLogin";
// import ProtectedRoute from "../../components/ProtectedRoute";

// // ================= NEW ATTENDANCE MODULE IMPORTS =================
// import AttendanceModule from "../pages/attendance/AttendanceModule";

// export default function AppRoutes() {
//   // Get user role from localStorage (or your auth context)
//   const getUserRole = () => {
//     const adminData = localStorage.getItem('adminData');
//     if (adminData) {
//       try {
//         const parsed = JSON.parse(adminData);
//         return parsed.role || 'employee';
//       } catch (e) {
//         return 'employee';
//       }
//     }
//     return 'employee';
//   };

//   return (
//     <Routes>
//       {/* ================= PUBLIC ROUTES ================= */}
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/services/:serviceId" element={<ServiceDetail />} />

//       {/* ================= STUDENT MODULE ================= */}
//       <Route path="/user/*" element={<StudentRoutes />} />

//       {/* ================= ADMIN MODULE ================= */}
//       <Route path="/admin/*" element={<AdminRoutes />} />

//       {/* ================= HR MODULE ================= */}
//       <Route
//         path="/hr"
//         element={
//           <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin"]}>
//             <HRLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="/hr/dashboard" replace />} />
//         <Route path="dashboard" element={<HRDashboard />} />
//         <Route path="module" element={<HRModule />} />
//         <Route path="change-password" element={<ChangePassword />} />
        
//         {/* Approvals route within HR module */}
//         <Route
//           path="approvals"
//           element={
//             <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin"]}>
//               <StudentApprovals />
//             </ProtectedRoute>
//           }
//         />

//         {/* ================= ATTENDANCE ROUTE FOR HR ================= */}
//         <Route
//           path="attendance"
//           element={
//             <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin"]}>
//               <AttendanceModule userRole="hr_manager" />
//             </ProtectedRoute>
//           }
//         />
//       </Route>

//       {/* ================= EMPLOYEE MODULE ================= */}
//       <Route
//         path="/employee"
//         element={
//           <ProtectedRoute allowedRoles={["employee", "hr_manager", "super_admin", "admin"]}>
//             <EmployeeLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Navigate to="/employee/dashboard" replace />} />
//         <Route path="dashboard" element={<EmployeeDashboard />} />
//         <Route path="attendance" element={<EmployeeAttendance />} />
//         <Route path="apply-leave" element={<EmployeeLeave />} />
//         <Route path="change-password" element={<ChangePassword />} />
        
//         {/* ================= ATTENDANCE ROUTE FOR EMPLOYEE ================= */}
//         <Route
//           path="attendance-module"
//           element={
//             <ProtectedRoute allowedRoles={["employee", "hr_manager", "super_admin", "admin"]}>
//               <AttendanceModule userRole="employee" />
//             </ProtectedRoute>
//           }
//         />
//       </Route>

//       {/* ================= STANDALONE ATTENDANCE ROUTE (Optional) ================= */}
//       {/* This route can be accessed from any layout if needed */}
//       <Route
//         path="/attendance"
//         element={
//           <ProtectedRoute allowedRoles={["employee", "hr_manager", "super_admin", "admin"]}>
//             <AttendanceModule userRole={getUserRole()} />
//           </ProtectedRoute>
//         }
//       />

//       {/* ================= 404 PAGE ================= */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }




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

// Attendance Module
import AttendanceModule from "../pages/attendance/AttendanceModule";

export default function AppRoutes() {
  // Get user role from localStorage
  const getUserRole = () => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        console.log("parsed.........", parsed)
        return parsed.role || 'employee';
      } catch (e) {
        return 'employee';
      }
    }
    return 'employee';
  };

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

        {/* ================= ATTENDANCE ROUTE FOR HR ================= */}
        <Route
          path="attendance"
          element={
            <ProtectedRoute allowedRoles={["hr_manager", "super_admin", "admin","employee"]}>
              <AttendanceModule userRole="hr_manager" />
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
        <Route path="attendance" element={<AttendanceModule />} />
        <Route path="apply-leave" element={<EmployeeLeave />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      {/* ================= STANDALONE ATTENDANCE ROUTE ================= */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["employee", "hr_manager", "super_admin", "admin"]}>
            <AttendanceModule userRole="employee" />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}