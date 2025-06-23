/**
 * routes.js
 *
 * Defines the main routing configuration for the React application using React Router.
 * Controls which page components render based on the current URL path.
 *
 * Route Descriptions:
 * - `/` → LoginPage: Public route for users to log in.
 * - `/catalogue` → CataloguePage: Legacy universal route (can be phased out).
 * - `/admin-catalogue` → AdminCataloguePage: Admin-only features (courses, programs).
 * - `/student-catalogue` → StudentCataloguePage: Student-only electives interface.
 * - `/programs` → ProgramsPage: Admin program management page.
 * - `*` (fallback) → Redirects all unknown paths back to `/`.
 */

import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AdminCataloguePage from '../pages/AdminCataloguePage.jsx';
import StudentCataloguePage from '../pages/StudentCataloguePage.jsx';
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const routes = [
    {
        path: '/',
        element: <LoginPage />
    },

    {
        path: '/admin-catalogue',
        element: (
            <ProtectedRoute
                element={<AdminCataloguePage />}
            />
        )
    },
    {
        path: '/student-catalogue',
        element: (
            <ProtectedRoute
                element={<StudentCataloguePage />}
            />
        )
    },

    {
        path: '*',
        element: <Navigate to="/" replace />
    }
];

export default routes;
