import LoginPage from '../pages/LoginPage.jsx';
import CataloguePage from '../pages/CataloguePage.jsx';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const routes = [
    { path: '/', element: <LoginPage /> },
    {
        path: '/catalogue',
        element: <ProtectedRoute element={<CataloguePage />} />
    },
    { path: '*', element: <Navigate to="/" replace /> }
];

export default routes;