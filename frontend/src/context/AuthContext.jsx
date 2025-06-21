/**
 * AuthContext.jsx
 *
 * Provides authentication context for the app, managing user role and email.
 * Stores authentication state (role, email) in localStorage for persistence.
 * Exposes login and logout functions to update auth state.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext to hold authentication state and functions
const AuthContext = createContext();
/**
 * AuthProvider Component
 *
 * Wraps app components and provides auth context values.
 * Manages role and email states, persisting them to localStorage.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - React children components
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
    // Initialize role and email state from localStorage (if available)
    const [role, setRole] = useState(() => localStorage.getItem('role') || null);
    const [email, setEmail] = useState(() => localStorage.getItem('email') || '');

    // Sync role changes to localStorage
    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        else localStorage.removeItem('role');
    }, [role]);
    // Sync email changes to localStorage
    useEffect(() => {
        if (email) localStorage.setItem('email', email);
        else localStorage.removeItem('email');
    }, [email]);

    /**
     * Login function to set user role and email in context and localStorage.
     *
     * @param {string} newRole - Role of the user (e.g., 'admin', 'student')
     * @param {string} userEmail - Email of the logged-in user
     */
    const loginAs = (newRole, userEmail) => {
        setRole(newRole);
        setEmail(userEmail);
    };
    /**
     * Logout function clears role and email from context and localStorage.
     */
    const logout = () => {
        setRole(null);
        setEmail('');
    };

    return (
        <AuthContext.Provider value={{ role, email, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
/**
 * Custom hook to access AuthContext values easily in any component.
 *
 * @returns {Object} Authentication context with role, email, loginAs, logout
 */
export const useAuth = () => useContext(AuthContext);