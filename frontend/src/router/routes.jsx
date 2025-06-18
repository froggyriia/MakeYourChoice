import LoginPage from '../pages/LoginPage.jsx';
import CataloguePage from '../pages/CataloguePage.jsx';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import CourseFormPage from '../pages/CourseFormpage.jsx';

const routes = [
    { path: '/', element: <LoginPage /> },
    {
        path: '/catalogue',
        element: <ProtectedRoute element={<CataloguePage />} />
    },
    {
        path: '/admin',
        element: <ProtectedRoute element={<CataloguePage />} requireAdmin={true} />
    },
    {
        path: '/form',
        element: <ProtectedRoute element={<CourseFormPage />} requireAdmin={false} />
    },
    { path: '*', element: <Navigate to="/" replace /> }
];

export default routes;