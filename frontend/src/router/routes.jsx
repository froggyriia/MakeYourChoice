// routes.jsx
import { Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import AdminCataloguePage from '../pages/AdminCataloguePage.jsx';
import AdminCoursesPage from '../pages/AdminCoursesPage.jsx';
import AdminProgramsPage from '../pages/AdminProgramsPage.jsx';
import StudentCataloguePage from '../pages/StudentCataloguePage.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminSemestersPage from '../pages/AdminSemestersPage.jsx';
import AdminSuggestedPage from '../pages/AdminSuggestedPage.jsx';

const routes = [
    {
        path: '/',
        element: <LoginPage />
    },

    {
        path: '/admin',
        element: (
            <ProtectedRoute requireAdmin={true}>
                <AdminCataloguePage />    {/* renders HeaderLayout, SidebarMenu, and an <Outlet/> */}
            </ProtectedRoute>
        ),
        children: [
            // default /admin → /admin/courses
            { index: true,           element: <Navigate to="courses" replace /> },

            // /admin/courses
            { path: 'courses',       element: <AdminCoursesPage /> },

            // /admin/programs
            { path: 'programs',      element: <AdminProgramsPage /> },

            // /admin/semesters
            { path: 'semesters',     element: <AdminSemestersPage /> },

            // /admin/suggested_courses
            { path: 'suggested_courses', element: <AdminSuggestedPage /> },

            // /admin/declined_courses
            { path: 'declined_courses', element: <DeclinedCoursesPage /> },
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
        path: '/suggest-form',
        element: <SuggestFormPage />
    },

    {
        path: '*',
        element: <Navigate to="/" replace />
    }
];

export default routes;
