// // src/routes/AppRoutes.jsx
// import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import About from "../pages/About";
// import Services from "../pages/Services";
// import Contact from "../pages/Contact";
// import AdminLogin from "../admin/AdminLogin";
// import User from "../user/userLogin";
// import ServiceDetail from "../pages/ServiceDetail";
// import UserRegister from "../user/Register";
// import UserLogin from "../user/userLogin";
// import AdminLayout from "../admin/AdminLayout";
// import StudentList from "../admin/StudentList";
// import PaymentHistory from "../admin/PaymentHistory";
// import HRModule from "../admin/HumanResource";
// import CreatUser from "../admin/CreateAdmin";
// import ChangePassword from '../../components/admin/ChangePassword';
// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/admin/createuser" element={<CreatUser />} />
//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/dashboard" element={<StudentList />} />
//       <Route path="/admin/students" element={<StudentList />} />
//       <Route path="/admin/payments" element={<PaymentHistory />} />
//       <Route path="/admin/hr" element={<HRModule />} />
//       <Route path="/admin/change-password" element={<ChangePassword />} />
      
//       <Route path="/admin/*" element={<AdminLayout />} />
//       <Route path="/user" element={<User />} />
//       <Route path="/services/:serviceId" element={<ServiceDetail />} />
//       <Route path="/user">
//         {/* Default to login when /user is clicked */}
//         <Route index element={<UserLogin />} />
//         <Route path="login" element={<UserLogin />} />
//         <Route path="register" element={<UserRegister />} />
//       </Route>
//     </Routes>
//   );
// }


// src/routes/AppRoutes.jsx
// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "../pages/Home";
// import About from "../pages/About";
// import Services from "../pages/Services";
// import Contact from "../pages/Contact";
// import AdminLogin from "../admin/AdminLogin";
// import User from "../user/userLogin";
// import ServiceDetail from "../pages/ServiceDetail";
// import UserRegister from "../user/Register";
// import UserLogin from "../user/userLogin";
// import AdminLayout from "../admin/AdminLayout";
// import StudentList from "../admin/StudentList";
// import PaymentHistory from "../admin/PaymentHistory";
// import HRModule from "../admin/HumanResource";
// import CreatUser from "../admin/CreateAdmin";
// import ChangePassword from "../admin/ChangePassword";
// import AdminDashboard from "../admin/AdminDashboard"; // Create this component

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/services" element={<Services />} />
//       <Route path="/contact" element={<Contact />} />
//       <Route path="/services/:serviceId" element={<ServiceDetail />} />
      
//       {/* Admin Routes - Protected by AdminLayout */}
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route index element={<Navigate to="/admin/dashboard" replace />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="students" element={<StudentList />} />
//         <Route path="payments" element={<PaymentHistory />} />
//         <Route path="hr" element={<HRModule />} />
//         <Route path="createuser" element={<CreatUser />} />
//         <Route path="change-password" element={<ChangePassword />} />
//       </Route>
      
//       {/* Separate admin routes without layout */}
//       <Route path="/admin/login" element={<AdminLogin />} />
      
//       {/* User Routes */}
//       <Route path="/user" element={<User />} />
//       <Route path="/user/login" element={<UserLogin />} />
//       <Route path="/user/register" element={<UserRegister />} />
//     </Routes>
//   );
// }



// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import AdminLogin from "../admin/AdminLogin";
import ServiceDetail from "../pages/ServiceDetail";
import UserRegister from "../user/Register";
import UserLogin from "../user/userLogin";
import AdminLayout from "../admin/AdminLayout";
import StudentList from "../admin/StudentList";
import PaymentHistory from "../admin/PaymentHistory";
// import HRModule from "../admin/HumanResource";
import CreatUser from "../admin/CreateAdmin";
import ChangePassword from "../admin/ChangePassword";
import AdminDashboard from "../admin/AdminDashboard";
import ProtectedRoute from "../../components/ProtectedRoute";

import HRLayout from "../hrmodule/HRLayout";
import HRDashboard from "../hrmodule/HRDashboard";
import HRModule from "../hrmodule/HRModule";


// Employee Components
import EmployeeLayout from "../employee/EmployeeLayout";
import EmployeeDashboard from "../employee/EmployeeDashboard";
import EmployeeAttendance from "../employee/EmployeeAttendance";
import EmployeeLeave from "../employee/EmployeeLeave";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services/:serviceId" element={<ServiceDetail />} />
      
      {/* Admin Login - Public */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes - No loading state */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="hr" element={<HRModule />} />
        <Route path="createuser" element={<CreatUser />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      

      {/* HR Routes */}
      <Route path="/hr" element={<ProtectedRoute><HRLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/hr/dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="module" element={<HRModule />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>


       {/* Employee Routes */}
      <Route path="/employee" element={<ProtectedRoute><EmployeeLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="apply-leave" element={<EmployeeLeave />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      {/* User Routes */}
      <Route path="/user" element={<UserLogin />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}