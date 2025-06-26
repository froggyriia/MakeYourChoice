import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true); // 🆕 loading

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedEmail = localStorage.getItem('email');

        if (storedRole) setRole(storedRole);
        if (storedEmail) setEmail(storedEmail);

        setLoading(false); // 🆕 done loading
    }, []);

    const loginAs = (newRole, userEmail) => {
        setRole(newRole);
        setEmail(userEmail);
        localStorage.setItem('role', newRole);
        localStorage.setItem('email', userEmail);
    };

    const logout = () => {
        setRole(null);
        setEmail('');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
    };

    return (
        <AuthContext.Provider value={{ role, email, loginAs, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
