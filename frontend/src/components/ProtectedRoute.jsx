/**
 * ProtectedRoute.jsx
 *
 * This component acts as a wrapper for routes that require authentication and optional admin access.
 * It uses user role information from AuthContext to determine whether to allow access or redirect the user.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute Component
 *
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.element - The component to render if access is allowed.
 * @param {boolean} [props.requireAdmin=false] - Whether the route is restricted to admin users only.
 * @returns {JSX.Element} The protected component or a redirection to another route.
 */

const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const { role } = useAuth(); // Get the user's role from context
    // If no role is found, redirect to the login page
    if (!role) {
        return <Navigate to="/" />;
    }
    // If admin access is required but user is not an admin, redirect to catalogue
    if (requireAdmin && role == 'admin') {
        return <Navigate to="/admin-catalogue" />;
    }

    // If access is allowed, render the given element
    return element;
};

export default ProtectedRoute;