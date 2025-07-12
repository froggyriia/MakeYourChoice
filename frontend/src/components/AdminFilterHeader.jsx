import React, { useEffect, useState } from 'react';
import { useCatalogueContext } from '../context/CatalogueContext';
import { searchCoursesByTitle } from '../api/function_for_search';
import { fetchCourses } from '../api/functions_for_courses';
import styles from './FilterHeader.module.css';

const AdminFilterHeader = () => {
    const [searchText, setSearchText] = useState('');
    const { catalogue } = useCatalogueContext();
    const { setCourses, viewMode, setViewMode, email, setSearchQuery } = catalogue;

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            try {
                if (searchText.trim().length >= 3) {
                    const results = await searchCoursesByTitle(searchText);
                    setCourses(results);
                    setSearchQuery(searchText);
                } else if (searchText.trim() === '') {
                    const allCourses = await fetchCourses(email, true);
                    setCourses(allCourses);
                    setSearchQuery('');
                }
            } catch (err) {
                console.error('Search failed:', err);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText, email, setCourses, setSearchQuery]);

    return (
        <div className={styles.filterHeader}>
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>View</span>
                <div className={styles.buttonGroup}>
                    {['full', 'compact'].map((mode) => (
                        <button
                            key={mode}
                            className={`${styles.filterButton} ${viewMode === mode ? styles.active : ''}`}
                            onClick={() => setViewMode(mode)}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminFilterHeader;