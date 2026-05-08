// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import AdminLogin from "../admin/AdminLogin";
import User from "../user/userLogin";
import ServiceDetail from "../pages/ServiceDetail";
import UserRegister from "../user/Register";
import UserLogin from "../user/userLogin";
import AdminLayout from '../admin/AdminLayout'
import StudentList from "../admin/StudentList";
import PaymentHistory from "../admin/PaymentHistory";
import HRModule from "../admin/HumanResource";
import CreatUser from "../admin/CreateAdmin"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
       <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
         <Route path='/admindashboard' element={<AdminLayout/>}></Route>
         <Route path="/admin/students" element={<StudentList />} />
  <Route path="/admin/payments" element={<PaymentHistory />} />
  <Route path="/admin/hr" element={<HRModule />} />
  <Route path="/admin/createuser" element={<CreatUser />} />
  {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
      <Route path="/user" element={<User />} />
      <Route path="/services/:serviceId" element={<ServiceDetail />} />
      <Route path="/user">
        {/* Default to login when /user is clicked */}
        <Route index element={<UserLogin />} /> 
        <Route path="login" element={<UserLogin />} />
        <Route path="register" element={<UserRegister />} />
       
      </Route>
    </Routes>
  );
}