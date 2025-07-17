// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAdmin, isStudent } from '../hooks/validation.js';
import { isSingleActiveSemester } from '../api/functions_for_semesters.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [trueRole, setTrueRole] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentSem, setSem] = useState(null);

    useEffect(() => {
        const storedCurrentRole = localStorage.getItem('currentRole');
        const storedTrueRole = localStorage.getItem('trueRole');
        const storedEmail = localStorage.getItem('email');
        const storedSem = localStorage.getItem('currentSem');

        if (storedCurrentRole) setCurrentRole(storedCurrentRole);
        if (storedTrueRole) setTrueRole(storedTrueRole);
        if (storedEmail) setEmail(storedEmail);
        if (storedSem) setSem(storedSem);

        setLoading(false);
    }, []);

    const loginAs = async (userEmail) => {
        const admin = await isAdmin(userEmail);
        const student = await isStudent(userEmail);
        const semester = await isSingleActiveSemester();
        console.log('semAuth in auth', semester);

        let roleGroup;
        if (admin && student) roleGroup = 'admin-student';
        else if (admin) roleGroup = 'admin';
        else roleGroup = 'student';

        const resolvedRole = admin ? 'admin' : 'student';

        setTrueRole(roleGroup);
        setCurrentRole(resolvedRole);
        setEmail(userEmail);
        setSem(semester);

        localStorage.setItem('trueRole', roleGroup);
        localStorage.setItem('currentRole', resolvedRole);
        localStorage.setItem('email', userEmail);
        localStorage.setItem('currentSem', semester);

        return resolvedRole;
    };

    const logout = () => {
        setTrueRole(null);
        setCurrentRole(null);
        setEmail('');
        setSem(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ trueRole, currentRole, setCurrentRole, email, loginAs, logout, loading, currentSem }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
