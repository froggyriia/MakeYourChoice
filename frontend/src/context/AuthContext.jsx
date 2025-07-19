import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAdmin, isStudent } from '../hooks/validation.js';
import { isSingleActiveSemester } from '../api/functions_for_semesters.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [trueRole, setTrueRole] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentSemId, setCurrentSemId] = useState(null); // Теперь храним только ID

    // Загрузка данных при инициализации
    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedCurrentRole = localStorage.getItem('currentRole');
                const storedTrueRole = localStorage.getItem('trueRole');
                const storedEmail = localStorage.getItem('email');
                const storedSemId = localStorage.getItem('currentSemId');

                if (storedCurrentRole) setCurrentRole(storedCurrentRole);
                if (storedTrueRole) setTrueRole(storedTrueRole);
                if (storedEmail) setEmail(storedEmail);
                if (storedSemId) setCurrentSemId(storedSemId);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuthData();
    }, []);

    const loginAs = async (userEmail) => {
        try {
            const [admin, student, semester] = await Promise.all([
                isAdmin(userEmail),
                isStudent(userEmail),
                isSingleActiveSemester()
            ]);

            console.log('semAuth in auth', semester);

            if (!semester && currentRole === 'student') {
                throw new Error('Активный семестр не найден');
            }

            const roleGroup = admin
                ? (student ? 'admin-student' : 'admin')
                : 'student';

            const resolvedRole = admin ? 'admin' : 'student';

            // Обновляем состояние
            setTrueRole(roleGroup);
            setCurrentRole(resolvedRole);
            setEmail(userEmail);
            setCurrentSemId(semester.id);

            // Сохраняем в localStorage
            localStorage.setItem('trueRole', roleGroup);
            localStorage.setItem('currentRole', resolvedRole);
            localStorage.setItem('email', userEmail);
            localStorage.setItem('currentSemId', semester.id);

            return resolvedRole;
        } catch (error) {
            console.error('Ошибка входа:', error);
            throw error; // Пробрасываем ошибку для обработки в компоненте
        }
    };

    const logout = () => {
        setTrueRole(null);
        setCurrentRole(null);
        setEmail('');
        setCurrentSemId(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{
            trueRole,
            currentRole,
            setCurrentRole,
            email,
            currentSemId,
            loginAs,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);