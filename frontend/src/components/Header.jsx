import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';
import { getUserProgram } from "../api/functions_for_users.js";
import { getDeadlineForGroup } from '../api/functions_for_programs.js';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { searchCoursesByTitle } from '../api/function_for_search.js';
import { fetchCourses } from '../api/functions_for_courses.js';

const Header = () => {
    const { catalogue, excelExport } = useCatalogueContext();
    const {
        courseTypeFilter,
        programFilter
    } = catalogue;

    const navigate = useNavigate();
    const { logout, email, trueRole, currentRole, setCurrentRole } = useAuth();

    const [deadline, setDeadline] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);
    const emailButtonRef = useRef(null);

    // fetch deadline
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

    // search
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (currentRole !== 'student') return;

            setIsSearching(true);
            setSearchError(null);

            try {
                if (searchText.trim().length >= 3) {
                    const results = await searchCoursesByTitle(
                        searchText,
                        programFilter !== 'all' ? programFilter : undefined,
                        courseTypeFilter !== 'all' ? courseTypeFilter : undefined
                    );
                    catalogue.setCourses(results);
                } else if (searchText.trim() === '') {
                    const allCourses = await fetchCourses(email, false, {
                        types: courseTypeFilter !== 'all' ? [courseTypeFilter] : [],
                        programs: programFilter !== 'all' ? [programFilter] : []
                    });
                    catalogue.setCourses(allCourses);
                }
            } catch (err) {
                setSearchError('Search failed. Please try again.');
                console.error('Student search failed:', err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText, currentRole, programFilter, courseTypeFilter, email, catalogue.setCourses]);

    // close menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                emailButtonRef.current &&
                !emailButtonRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.searchAndDeadline}>
                    {deadline && currentRole !== 'admin' && (
                        <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                    )}

                    {currentRole === 'student' && (
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder={`Search in ${courseTypeFilter !== 'all' ? courseTypeFilter : 'all'} courses...`}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className={styles.searchInput}
                            />
                            {isSearching && <div className={styles.spinner} />}
                        </div>
                    )}
                </div>

                <div className={styles.emailContainer}>
                    <button
                        ref={emailButtonRef}
                        className={styles.emailButton}
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <span>{email}</span>
                        <span className={`${styles.arrow} ${menuOpen ? styles.open : ''}`}>▾</span>
                    </button>

                    {menuOpen && (
                        <div className={styles.dropdownMenu} ref={menuRef}>
                            {currentRole === 'admin' && (
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        excelExport.exportToExcel();
                                        setMenuOpen(false);
                                    }}
                                >
                                    <img width="16" height="16" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel"/> Export to Excel
                                </button>
                            )}

                            {trueRole === 'admin-student' && (
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        if (currentRole === 'admin') {
                                            setCurrentRole('student');
                                            navigate('/student-catalogue');
                                        } else {
                                            setCurrentRole('admin');
                                            navigate('/admin/courses');
                                        }
                                        setMenuOpen(false);
                                    }}
                                >
                                    <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/student-male.png" alt="student-male"/> {currentRole === 'admin' ? 'View as Student' : 'Back to Admin'}
                                </button>
                            )}

                            <button
                                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                            >
                                <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/exit.png" alt="exit"/> Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
