// src/routes/studentRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "../user/userLogin";
import UserRegister from "../user/Register";
import StudentFirstTimePasswordChange from '../user/FirstTimePasswordChange';
import StudentDashboard from '../user/StudentDashboard';
import ProtectedRoute from "../../components/ProtectedRoute";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/first-time-password" element={<StudentFirstTimePasswordChange />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default StudentRoutes;