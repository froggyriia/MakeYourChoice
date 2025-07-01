/**
 * CourseFormPage.jsx
 *
 * This page is used by students to select and submit their elective courses.
 * Admins can use this page to export course selection results to an Excel file.
 *
 * Data and functionality overview:
 * - `useAuth` provides current user's email and role (admin/student).
 * - `useFormSubmit(email)` handles course form submission for students.
 * - `useExcelExport` handles exporting results to Excel (for admin).
 * - UI includes a header, sidebar, and tabbed interface for switching between technical and humanities electives.
 */

import { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu.jsx';
import ElectivesForm from "../components/ElectivesForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from './CourseFormpage.module.css';
import Header from "../components/Header.jsx";

import { useExcelExport } from '../hooks/useExcelExport';
import { useFormSubmit } from '../hooks/useFormSubmit';

// Utility functions to fetch user and program info (not used here directly but imported for future use or debugging)
import { getUserProgram } from "../api/functions_for_users.js";
import { getProgramInfo } from "../api/functions_for_programs.js";

/**
 * Main component for rendering the course selection form.
 *
 * @returns {JSX.Element} A form interface for students and export button for admins.
 */
export default function CourseFormPage() {
    // Get user email and role from global auth context
    const { email, currentRole } = useAuth();
    console.log('Current email in CourseFormPage:', email);

    // Local state to toggle between "tech" and "hum" tabs
    const [activeTab, setActiveTab] = useState('tech');

    // Hook to export form results as an Excel file
    const { isExported, exportToExcel } = useExcelExport();

    // Hook for form submission (sends selected electives to backend)
    const { onSubmit } = useFormSubmit(email);

    return (
        <>
            <Header />

            <div className={styles.pageWrapper}>
                {/* Sidebar navigation (not interactive here but useful for layout and navigation) */}
                <SidebarMenu />

                <div className={styles.content}>
                    {/* === TAB HEADER FOR SWITCHING BETWEEN TECH AND HUM === */}
                    <div className={styles.headerContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'hum' ? styles.active : styles.inactive}`}
                            onClick={() => setActiveTab('hum')}
                        >
                            Hum
                        </button>

                        <h1 className={styles.title}>Course Form</h1>

                        <button
                            className={`${styles.tabButton} ${activeTab === 'tech' ? styles.active : styles.inactive}`}
                            onClick={() => setActiveTab('tech')}
                        >
                            Tech
                        </button>
                    </div>

                    {/* === ADMIN-ONLY: EXPORT RESULTS TO EXCEL === */}
                    {currentRole === 'admin' && (
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <button
                                onClick={exportToExcel}
                                className={styles.resultsButton}
                            >
                                {isExported ? 'Exported!' : 'Export to Excel'}
                            </button>
                        </div>
                    )}

                    {/* === STUDENT-ONLY: COURSE SELECTION FORM === */}
                    {currentRole !== 'admin' && (
                        <ElectivesForm
                            type={activeTab} // tech or hum
                            onSubmit={(selectedCourses) => onSubmit(selectedCourses, activeTab)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
