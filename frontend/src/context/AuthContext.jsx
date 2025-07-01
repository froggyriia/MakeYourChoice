// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAdmin, isStudent } from '../hooks/validation.js'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [trueRole, setTrueRole] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCurrentRole = localStorage.getItem('currentRole');
        const storedTrueRole = localStorage.getItem('trueRole');
        const storedEmail = localStorage.getItem('email');

        if (storedCurrentRole) setCurrentRole(storedCurrentRole);
        if (storedTrueRole) setTrueRole(storedTrueRole);
        if (storedEmail) setEmail(storedEmail);

        setLoading(false);
    }, []);

    const loginAs = async (userEmail) => {
        const admin = await isAdmin(userEmail);
        const student = await isStudent(userEmail);

        let roleGroup;
        if (admin && student) roleGroup = 'admin-student';
        else if (admin) roleGroup = 'admin';
        else roleGroup = 'student';

        const resolvedRole = admin ? 'admin' : 'student';

        setTrueRole(roleGroup);
        setCurrentRole(resolvedRole);
        setEmail(userEmail);

        localStorage.setItem('trueRole', roleGroup);
        localStorage.setItem('currentRole', resolvedRole);
        localStorage.setItem('email', userEmail);

        return resolvedRole;
    };

    const logout = () => {
        setTrueRole(null);
        setCurrentRole(null);
        setEmail('');
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ trueRole, currentRole, setCurrentRole, email, loginAs, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
