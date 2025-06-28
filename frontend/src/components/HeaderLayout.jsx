/**
 * HeaderLayout.jsx
 *
 * This component composes the layout that includes the fixed header and the filter bar below it.
 * It integrates the main header, filters for course selection, and student-specific course type tabs.
 *
 *  Data Sources:
 * - Filter state and user role from CatalogueContext
 * - Course type filter from the same context
 */

import React from 'react';
import Header from './Header';
import FilterBar from './FilterBar';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import styles from './Header.module.css';

/**
 * Layout component that renders:
 * - A fixed header with user info and admin controls
 * - A filter bar for searching/filtering courses
 * - Student-specific toggle tabs for course type
 */
const HeaderLayout = () => {
    const { catalogue } = useCatalogueContext();
    const { filters, setFilters, courseTypeFilter, setCourseTypeFilter } = catalogue;
    console.log("[HeaderLayout] filters state:", filters);
    return (
        <>
            <Header /> {/* Top fixed header */}

            {/* Section below header: filter bar + student tabs */}
            <div className={styles.belowHeader}>
                {/* Filters for programs, language, year, etc. */}
                <FilterBar filters={filters} setFilters={setFilters} />

                {/* Course type tabs (only visible to students) */}
                {catalogue.role === 'student' && (
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
            </div>
        </>
    );
};

export default HeaderLayout;
