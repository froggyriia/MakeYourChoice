// routes.jsx
import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AdminCataloguePage from '../pages/AdminCataloguePage.jsx';
import AdminCoursesPage from '../pages/AdminCoursesPage.jsx';
import AdminProgramsPage from '../pages/AdminProgramsPage.jsx';
import StudentCataloguePage from '../pages/StudentCataloguePage.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const routes = [
    {
        path: '/',
        element: <LoginPage />
    },

    {
        path: '/admin',
        element: (
            <ProtectedRoute
                element={<AdminCataloguePage />}
                requireAdmin={true}
            />
        ),
        children: [
            {
                path: 'courses',
                element: (
                    <ProtectedRoute
                        element={<AdminCoursesPage />}
                        requireAdmin={true}
                    />
                )
            },
            {
                path: 'programs',
                element: (
                    <ProtectedRoute
                        element={<AdminProgramsPage />}
                        requireAdmin={true}
                    />
                )
            },
            {
                index: true,
                element: <Navigate to="courses" replace />
            }
        ]
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
