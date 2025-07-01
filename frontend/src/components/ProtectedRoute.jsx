// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ element, requireAdmin = false }) => {
    const { currentRole, trueRole, loading } = useAuth();

    if (loading) return null;

    if (!currentRole) return <Navigate to="/" replace />;

    // Разрешаем доступ к admin, если:
    // 1. Требуется админ-доступ
    // 2. currentRole не админ, но пользователь в принципе является админом (в trueRole)
    if (requireAdmin && currentRole !== 'admin') {
        // если у пользователя нет вообще прав администратора — запрет
        if (trueRole !== 'admin' && trueRole !== 'admin-student') {
            return <Navigate to="/student-catalogue" replace />;
        }
        // если текущая роль = student, но есть права администратора — можно ждать переключения
        return <Navigate to="/student-catalogue" replace />;
    }

    return element;
};

export default ProtectedRoute;
