import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Компонент-защитник маршрутов, проверяет авторизацию и роль
const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const { role } = useAuth();

    // Если пользователь не авторизован — редирект на страницу логина
    if (!role) {
        return <Navigate to="/" />;
    }

    // Если нужна роль админа, а у пользователя другая роль — редирект в каталог
    if (requireAdmin && role !== 'admin') {
        return <Navigate to="/catalogue" />;
    }

    // Если всё ок — показываем нужный элемент (страницу)
    return element;
};

export default ProtectedRoute;