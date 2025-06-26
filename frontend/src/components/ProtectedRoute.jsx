import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const { role, loading } = useAuth();

    if (loading) return null;

    if (!role) return <Navigate to="/" replace />;
    if (requireAdmin && role !== 'admin') return <Navigate to="/student-catalogue" replace />;

    return element;
};

export default ProtectedRoute;