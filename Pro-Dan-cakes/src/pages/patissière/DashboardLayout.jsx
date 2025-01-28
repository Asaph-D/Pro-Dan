import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Auth/AuthContext';
import AdminDashboard from './AdminDashboard';

// Import your admin pages
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {children}
    </div>
  );
};

const AdminRoutes = () => {
  const { role, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  // Protect admin routes
  if (!isLoggedIn || role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </DashboardLayout>
  );
};

export default AdminRoutes;