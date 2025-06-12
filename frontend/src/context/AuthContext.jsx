import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст для авторизации
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(() => localStorage.getItem('role') || null);
    const [email, setEmail] = useState(() => localStorage.getItem('email') || '');

    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        else localStorage.removeItem('role');
    }, [role]);

    useEffect(() => {
        if (email) localStorage.setItem('email', email);
        else localStorage.removeItem('email');
    }, [email]);

    const loginAs = (newRole, userEmail) => {
        setRole(newRole);
        setEmail(userEmail);
    };

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

export const useAuth = () => useContext(AuthContext);