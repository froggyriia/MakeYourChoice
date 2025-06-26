// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminCataloguePage from './pages/AdminCataloguePage.jsx';
import AdminCoursesPage from './pages/AdminCoursesPage.jsx';
import AdminProgramsPage from './pages/AdminProgramsPage.jsx';
import StudentCataloguePage from './pages/StudentCataloguePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { CatalogueProvider } from './context/CatalogueContext.jsx';


export default function App() {
    return (
        <CatalogueProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route
                    path="/admin-catalogue"
                    element={
                        <ProtectedRoute
                            element={<AdminCataloguePage />}
                            requireAdmin={true}
                        />
                    }
                >
                    <Route
                        path="courses"
                        element={
                            <ProtectedRoute
                                element={<AdminCoursesPage />}
                                requireAdmin={true}
                            />
                        }
                    />
                    <Route
                        path="programs"
                        element={
                            <ProtectedRoute
                                element={<AdminProgramsPage />}
                                requireAdmin={true}
                            />
                        }
                    />
                    <Route index element={<Navigate to="courses" replace />} />
                </Route>

                <Route
                    path="/student-catalogue"
                    element={
                        <ProtectedRoute element={<StudentCataloguePage />} />
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </CatalogueProvider>
    );
}
