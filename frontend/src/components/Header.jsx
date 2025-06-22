/**
 * Header.jsx
 *
 * This component renders the top header bar for authenticated users.
 * It displays the user's email, logout button, and — if the user is a student — the program deadline.
 * For admin users, it also shows buttons to add courses, add student programs, and export data to Excel.
 *
 * ➕ Data Sources:
 * - User email and role from AuthContext
 * - Academic group (program) from getUserProgram()
 * - Program deadline from getDeadlineForGroup()
 * - Export function from useExcelExport()
 * - UI state and actions from CatalogueContext
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Provides user email, role, and logout function
import styles from './Header.module.css'; // Module-scoped CSS styling
import { getUserProgram } from "../api/functions_for_users.js"; // API to get user's academic group
import { getDeadlineForGroup } from '../api/functions_for_programs.js'; // API to get program deadline
import { isAdmin } from "../utils/validation.js"; // Utility to check if a user is an admin
import { useExcelExport } from "../hooks/useExcelExport.js"; // Custom hook for Excel export functionality
import { useCatalogueContext } from '../context/CatalogueContext.jsx'; // Context for course/program state management

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
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;
    const navigate = useNavigate(); // Navigation hook
    const { logout, email, role } = useAuth(); // Destructure user info and logout method
    const [deadline, setDeadline] = useState(null); // Local state to hold formatted deadline

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

        fetchDeadline(); // Run the async function
    }, [email]); // Dependency: re-run when email changes

    // If the user is not logged in, don't render anything
    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                {/* Display logged-in user's email */}
                <span className={styles.email}>{email}</span>

                {/* Show deadline for non-admin users */}
                {deadline && !isAdmin(email) && (
                    <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                )}
            </div>

            {/* Admin-only controls for course and program management */}
            {role === 'admin' && (
                <div className={styles.adminActions}>
                    {/* Triggers course addition workflow from context */}
                    <button
                        className={styles.addCourseButton}
                        onClick={catalogue.startAddingCourse}
                    >
                        Add course
                    </button>

                    {/* Opens modal to add a new student program */}
                    <button
                        className={styles.addCourseButton}
                        onClick={() => programs.setShowModal(true)}
                    >
                        Add Student Program
                    </button>

                    {/* Exports current priorities data to Excel */}
                    <button
                        onClick={excelExport.exportToExcel}
                        className={styles.exportButton}
                    >
                        {excelExport.isExported ? 'Exported!' : 'Export to Excel'}
                    </button>
                </div>
            )}

            {role === 'student' && (
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${courseTypeFilter === 'tech' ? styles.active : ''}`}
                        onClick={() => setCourseTypeFilter('tech')}
                    >
                        Technical
                    </button>
                    <button
                        className={`${styles.tabButton} ${courseTypeFilter === 'hum' ? styles.active : ''}`}
                        onClick={() => setCourseTypeFilter('hum')}
                    >
                        Humanities
                    </button>
                </div>
            )}

            {/* Always visible logout button */}
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log out
            </button>
        </div>
    );
};

export default Header;
