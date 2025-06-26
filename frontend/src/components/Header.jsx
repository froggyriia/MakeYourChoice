/**
 * Header.jsx
 *
 * This component renders the top header bar for authenticated users.
 * It displays the user's email, logout button, and — if the user is a student — the program deadline.
 * For admin users, it also shows buttons to add courses, add student programs, and export data to Excel.
 *
 * Data Sources:
 * - User email and role from AuthContext
 * - Academic group (program) from getUserProgram()
 * - Program deadline from getDeadlineForGroup()
 * - Export function from useExcelExport()
 * - UI state and actions from CatalogueContext
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';
import { getUserProgram } from "../api/functions_for_users.js";
import { getDeadlineForGroup } from '../api/functions_for_programs.js';
import { isAdmin } from "../utils/validation.js";
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

/**
 * Header component that handles:
 * - Displaying user info
 * - Showing deadline for students
 * - Admin actions: Add course, add program, export data
 * - Logout functionality
 */
const Header = () => {
    // Get shared catalogue state and admin action handlers
    const { catalogue, programs, excelExport } = useCatalogueContext();
    const { viewMode, setViewMode, courseTypeFilter, setCourseTypeFilter } = catalogue;
    const navigate = useNavigate();
    const { logout, email, role } = useAuth();
    const [deadline, setDeadline] = useState(null);
    const location = useLocation();
    const currentPath = location.pathname;


    /**
     * Handles user logout by:
     * - Clearing session via AuthContext
     * - Redirecting user to the homepage
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    /**
     * Fetches and sets the program deadline based on the logged-in user's group.
     * This only runs on mount or when the email changes.
     */
    useEffect(() => {
        const fetchDeadline = async () => {
            if (!email) return;

            // Fetch academic program/group for this user
            const group = await getUserProgram(email);
            console.log(group); // For debugging: log user group

            if (group) {
                // Get the submission deadline for that group
                const deadlineTs = await getDeadlineForGroup(group);

                if (deadlineTs) {
                    // Format timestamp into readable date string
                    const formatted = new Date(deadlineTs).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    setDeadline(formatted);
                }
            }
        };

        fetchDeadline(); // Execute on mount or email change
    }, [email]);

    // If the user is not logged in, don't render anything
    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <span className={styles.email}>{email}</span>

                {role === 'admin' && (
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.btn} ${viewMode === 'compact' ? styles['btn--green'] : styles['btn--gray']}`}
                            onClick={() => setViewMode('compact')}
                        >
                            Compact
                        </button>
                        <button
                            className={`${styles.btn} ${viewMode === 'full' ? styles['btn--green'] : styles['btn--gray']}`}
                            onClick={() => setViewMode('full')}
                        >
                            Full
                        </button>
                    </div>
                )}

                {deadline && !isAdmin(email) && (
                    <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                )}
            </div>

            {role === 'admin' && (
                <div className={styles.buttonGroup}>
                    {currentPath.includes('/admin-catalogue/courses') && (
                        <button
                            className={`${styles.btn} ${styles['btn--green']}`}
                            onClick={catalogue.startAddingCourse}
                        >
                            Add course
                        </button>
                    )}

                    {currentPath.includes('/admin-catalogue/programs') && (
                        <button
                            className={`${styles.btn} ${styles['btn--green']}`}
                            onClick={() => programs.setShowModal(true)}
                        >
                            Add Student Program
                        </button>
                    )}

                    <button
                        className={`${styles.btn} ${styles['btn--green']}`}
                        onClick={excelExport.exportToExcel}
                    >
                        {excelExport.isExported ? 'Exported!' : 'Export to Excel'}
                    </button>
                </div>
            )}

            <button
                onClick={handleLogout}
                className={`${styles.btn} ${styles['btn--red']}`}
            >
                Log out
            </button>
        </div>
    );
};

export default Header;