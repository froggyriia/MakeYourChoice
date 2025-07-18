import React, { useEffect, useState } from 'react';
import styles from './FilterBar.module.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { searchCoursesByTitle } from '../api/function_for_search.js';
import { fetchCourses } from '../api/functions_for_courses.js';
import { getUserProgram } from '../api/functions_for_users.js';

/**
 * Student-only FilterBar component.
 * Allows toggling course type (tech/hum), language and search.
 */
const FilterBar = ({ filters = {}, setFilters }) => {
    const { currentRole, email, currentSemId } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;

    const [studentProgram, setStudentProgram] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    if (currentRole !== 'student') return null;

    const toggleLanguage = (lang) => {
        setFilters((prev) => {
            const current = prev.languages || [];
            const updated = current.includes(lang)
                ? current.filter((l) => l !== lang)
                : [...current, lang];
            return { ...prev, languages: updated };
        });
    };

    const isLangActive = (lang) => {
        return (filters.languages || []).includes(lang);
    };

    useEffect(() => {
        const fetchProgram = async () => {
            if (!email || currentRole !== 'student') return;
            const group = await getUserProgram(email);
            setStudentProgram(group);
        };
        fetchProgram();
    }, [email, currentRole]);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (currentRole !== 'student' || !studentProgram) return;

            setIsSearching(true);
            try {
                if (searchText.trim().length >= 3) {
                    const res = await searchCoursesByTitle(
                        searchText,
                        studentProgram,
                        courseTypeFilter !== 'all' ? courseTypeFilter : undefined
                    );
                    catalogue.setCourses(res);
                    catalogue.setSearchQuery(searchText);
                } else if (searchText.trim() === '') {
                    const all = await fetchCourses(email, false, currentSemId);

                    // Clean Green Highlight
                    const cleared = all.map(course => {
                        const { _matches, ...rest } = course;
                        return rest;
                    });

                    catalogue.setCourses(cleared);
                    catalogue.setSearchQuery('');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [searchText, email, courseTypeFilter, studentProgram]);

    if (!email) return null;

    return (
        <div className={styles.filterBarContainer}>
            {/* Course Type: tech / hum */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Type</span>
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

            {/* Language: Eng / Rus */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Language</span>
                {['Eng', 'Rus'].map((lang) => (
                    <button
                        key={lang}
                        className={`${styles.filterButton} ${isLangActive(lang) ? styles.active : ''}`}
                        onClick={() => toggleLanguage(lang)}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className={styles.filterGroup}>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search..."
                    className={styles.searchInput}
                />
            </div>
        </div>
    );
};

export default FilterBar;