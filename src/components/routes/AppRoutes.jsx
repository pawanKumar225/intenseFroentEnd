// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Admin from "../pages/Admin";
import User from "../pages/User";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
       <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      <Route path="/user" element={<User />} />
    </Routes>
  );
}