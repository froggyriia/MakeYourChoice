import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст для авторизации
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Состояние роли пользователя: читаем из localStorage при инициализации
    const [role, setRole] = useState(() => localStorage.getItem('role') || null);
    const [email, setEmail] = useState(() => localStorage.getItem('email') || null);

    // При изменении роли сохраняем ее в localStorage, чтобы сохранить между обновлениями страницы
    useEffect(() => {
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [role]);

    useEffect(() => {
        if (email) {
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('email');
        }
    }, [email]);

    // Функция для установки роли пользователя (логина)
    const loginAs = (newRole, userEmail) => {
        setRole(newRole);
        setEmail(userEmail);
    };

    // Функция для выхода из системы — сбрасываем роль
    const logout = () => {
        setRole(null);
        setEmail(null);
    };

    // Передаем роль и функции через провайдер контекста
    return (
        <AuthContext.Provider value={{ role, email, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для удобного использования контекста авторизации
export const useAuth = () => useContext(AuthContext);