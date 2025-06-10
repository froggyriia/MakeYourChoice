import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст для авторизации
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Состояние роли пользователя: читаем из localStorage при инициализации
    const [role, setRole] = useState(() => localStorage.getItem('role') || null);

    // При изменении роли сохраняем ее в localStorage, чтобы сохранить между обновлениями страницы
    useEffect(() => {
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [role]);

    // Функция для установки роли пользователя (логина)
    const loginAs = (newRole) => {
        setRole(newRole);
    };

    // Функция для выхода из системы — сбрасываем роль
    const logout = () => {
        setRole(null);
    };

    // Передаем роль и функции через провайдер контекста
    return (
        <AuthContext.Provider value={{ role, loginAs, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для удобного использования контекста авторизации
export const useAuth = () => useContext(AuthContext);