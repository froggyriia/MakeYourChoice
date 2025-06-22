/**
 * routes.js
 *
 * Defines the main routing configuration for the React application using React Router.
 * Controls which page components render based on the current URL path.
 *
 * Route Descriptions:
 * - `/` → LoginPage: Public route for users to log in.
 * - `/catalogue` → CataloguePage: Protected route accessible only after authentication.
 * - `*` (fallback) → Redirects all unknown paths back to `/`.
 *
 * Components Used:
 * - `LoginPage`: The entry point for users (email authentication).
 * - `CataloguePage`: Main application interface after login.
 * - `ProtectedRoute`: Higher-order component that wraps protected pages and redirects unauthenticated users.
 * - `Navigate`: From `react-router-dom`, handles programmatic redirection.
 */

import LoginPage from '../pages/LoginPage.jsx';
import CataloguePage from '../pages/CataloguePage.jsx';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Array of route objects to be consumed by React Router
const routes = [
    {
        path: '/',                     // Home page path
        element: <LoginPage />         // Public login page
    },
    {
        path: '/catalogue',            // Protected route for viewing/modifying courses
        element: (
            <ProtectedRoute           // Wraps CataloguePage to ensure user is authenticated
                element={<CataloguePage />}
            />
        )
    },
    {
        path: '*',                     // Catch-all for any undefined routes
        element: <Navigate to="/" replace /> // Redirects unknown routes to the login page
    }
];

export default routes;
