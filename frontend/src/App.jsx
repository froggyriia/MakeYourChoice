// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminCataloguePage from './pages/AdminCataloguePage.jsx';
import AdminCoursesPage from './pages/AdminCoursesPage.jsx';
import AdminProgramsPage from './pages/AdminProgramsPage.jsx';
import StudentCataloguePage from './pages/StudentCataloguePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { CatalogueProvider } from './context/CatalogueContext.jsx';
import AdminSemesterPage from "./pages/AdminSemesterPage.jsx";
import AdminSuggestedPage from "./pages/AdminSuggestedPage.jsx";
import SuggestFormPage from "./pages/SuggestFormPage.jsx";
import DeclinedCoursesPage from "./pages/DeclinedCoursesPage.jsx";
import { Toaster } from 'react-hot-toast';


export default function App() {
    return (
        <CatalogueProvider>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/suggest-form" element={<SuggestFormPage />} />

                <Route
                    path="/admin"
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

                <Route
                    path="semesters"
                    element={
                        <ProtectedRoute
                            element={<AdminSemesterPage />}
                            requireAdmin={true}
                        />
                    }
                />

                <Route
                    path="suggested_courses"
                    element={
                        <ProtectedRoute
                            element={<AdminSuggestedPage />}
                            requireAdmin={true}
                        />
                    }
                />

                <Route
                    path="declined_courses"
                    element={
                        <ProtectedRoute
                            element={<DeclinedCoursesPage />}
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
