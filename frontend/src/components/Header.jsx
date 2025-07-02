/**
 * Header.jsx
 *
 * This component renders the top header bar for authenticated users.
 * It displays the user's email, logout button, and — if the user is a student — the program deadline.
 * For admin users, it also shows buttons to add courses, add student programs, and export data to Excel.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';
import { getUserProgram } from "../api/functions_for_users.js";
import { getDeadlineForGroup } from '../api/functions_for_programs.js';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

const Header = () => {
    const { catalogue, programs, excelExport } = useCatalogueContext();
    const { viewMode, setViewMode, courseTypeFilter, setCourseTypeFilter } = catalogue;

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const { logout, email, trueRole, currentRole, setCurrentRole } = useAuth();

    const [deadline, setDeadline] = useState(null);
    const [searchText, setSearchText] = useState('');

    /**
     * Fetch deadline based on user group (for non-admins)
     */
    useEffect(() => {
        const fetchDeadline = async () => {
            if (!email || currentRole === 'admin') return;

            const group = await getUserProgram(email);
            if (!group) return;

            const deadlineTs = await getDeadlineForGroup(group);
            if (!deadlineTs) return;

            const formatted = new Date(deadlineTs).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
            });

            setDeadline(formatted);
        };

        fetchDeadline();
    }, [email, currentRole]);

    // If the user is not logged in, render nothing
    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <span className={styles.email}>{email}</span>

                {currentRole === 'admin' && currentPath.includes('/admin/courses') && (
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

                {deadline && currentRole !== 'admin' && (
                    <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                )}
            </div>

            {currentRole === 'admin' && (
                <div className={styles.buttonGroup}>
                    {currentPath.includes('/admin/courses') && (
                        <button
                            className={`${styles.btn} ${styles['btn--green']}`}
                            onClick={catalogue.startAddingCourse}
                        >
                            Add course
                        </button>
                    )}

                    {currentPath.includes('/admin/programs') && (
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

            {trueRole === 'admin-student' && (
            <button
                className={`${styles.btn} ${styles['btn--green']}`}
                onClick={() => {
                    if (currentRole === 'admin') {
                        setCurrentRole('student');
                        navigate('/student-catalogue');
                    } else {
                        setCurrentRole('admin');
                        navigate('/admin/courses');
                    }
                }}
            >
            {currentRole === 'admin' ? 'View as Student' : 'Back to Admin'}
            </button>
            )}

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search courses..."
                    className={styles.searchInput}
                />
                <button
                    onClick={() => {
                        console.log('Search clicked. Query:', searchText);
                        alert(`Search for: ${searchText}`);
                    }}
                    className={`${styles.btn} ${styles['btn--green']}`}
                >
                    Search
                </button>
            </div>

            <button
                onClick={logout}
                className={`${styles.btn} ${styles['btn--red']}`}
            >
                Log out
            </button>
        </div>
    );
};

export default Header;