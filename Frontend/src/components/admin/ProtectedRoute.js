import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.adminAuth);
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;