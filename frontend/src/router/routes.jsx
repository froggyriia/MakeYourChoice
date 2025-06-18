//routes.jsx

import LoginPage from '../pages/LoginPage.jsx';
import CataloguePage from '../pages/CataloguePage.jsx';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import CourseFormPage from '../pages/CourseFormpage.jsx';


// Определяем маршруты приложения
const routes = [
    // Страница логина, открыта всем
    { path: '/', element: <LoginPage /> },
    // Каталог курсов — защищенный маршрут, доступен любому авторизованному пользователю
    {
        path: '/catalogue',
        element: <ProtectedRoute element={<CataloguePage />} />
    },
    // Админская страница (можно переиспользовать CataloguePage), доступна только админам
    {
        path: '/admin',
        element: <ProtectedRoute element={<CataloguePage />} requireAdmin={true} />
    },
    // Все остальные пути редиректим на логин
    { path: '*', element: <Navigate to="/" /> },

    {path: '/form', element: <ProtectedRoute element={<CourseFormPage />} />}
];

export default routes;