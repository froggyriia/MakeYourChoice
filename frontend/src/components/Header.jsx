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
    const { catalogue, programs, excelExport } = useCatalogueContext();
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;
    const navigate = useNavigate();
    const { logout, email, role } = useAuth();
    const [deadline, setDeadline] = useState(null);

    /**
     * Logs the user out by calling context method and redirects to the homepage.
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    /**
     * Retrieves the user's academic program and its corresponding deadline.
     * Converts the deadline timestamp into a readable format and stores it in state.
     */
    useEffect(() => {
        const fetchDeadline = async () => {
            if (!email) return;

            const group = await getUserProgram(email); // Get user's academic group
            if (group) {
                const deadlineTs = await getDeadlineForGroup(group); // Get deadline for the group
                if (deadlineTs) {
                    const formatted = new Date(deadlineTs).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    setDeadline(formatted); // Save formatted deadline in state
                }
            }
        };

        fetchDeadline(); // Execute on mount or email change
    }, [email]);

    // If no email is present, do not render the header
    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                {/* Show user's email */}
                <span className={styles.email}>{email}</span>

                {/* Show deadline if user is not an admin */}
                {deadline && !isAdmin(email) && (
                    <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                )}
            </div>

            {/* Admin-specific action buttons */}
            {role === 'admin' && (
                <div className={styles.adminActions}>
                    {/* Trigger add course workflow */}
                    <button
                        className={styles.addCourseButton}
                        onClick={catalogue.startAddingCourse}
                    >
                        Add course
                    </button>

                    {/* Open modal to add student program */}
                    <button
                        className={styles.addCourseButton}
                        onClick={() => programs.setShowModal(true)}
                    >
                        Add Student Program
                    </button>

                    {/* Export priority data to Excel */}
                    <button
                        onClick={excelExport.exportToExcel}
                        className={styles.exportButton}
                    >
                        {excelExport.isExported ? 'Exported!' : 'Export to Excel'}
                    </button>
                </div>
            )}

            {/* Logout control for all users */}
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log out
            </button>
        </div>
    );
};

export default Header;
