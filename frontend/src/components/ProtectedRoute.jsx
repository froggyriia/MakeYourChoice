import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const { role } = useAuth();

    if (!role) {
        return <Navigate to="/" />;
    }

    if (requireAdmin && role !== 'admin') {
        return <Navigate to="/catalogue" />;
    }

    return element;
};

export default ProtectedRoute;