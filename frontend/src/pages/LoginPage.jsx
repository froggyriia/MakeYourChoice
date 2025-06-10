import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
    // Получаем функцию для установки роли из контекста авторизации
    const { loginAs } = useAuth();
    // Хук для навигации между страницами
    const navigate = useNavigate();

    // Обработчик клика по кнопке "Я студент"
    const handleStudentClick = () => {
        loginAs('student');      // Устанавливаем роль 'student'
        navigate('/catalogue');  // Переходим в каталог курсов
    };

    // Обработчик клика по кнопке "Я админ"
    const handleAdminClick = () => {
        loginAs('admin');        // Устанавливаем роль 'admin'
        navigate('/catalogue');  // Переходим в каталог курсов
    };

    return (
        <div>
            {/* Кнопки выбора роли пользователя */}
            <button className="btn" onClick={handleStudentClick}>Я студент</button>
            <button className="btn" onClick={handleAdminClick}>Я админ</button>
        </div>
    );
}