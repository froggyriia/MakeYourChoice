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
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../context/AuthContext';
import AdminSubMenu from "@/components/AdminSubMenu.jsx";
/**
 * Layout component that renders:
 * - A fixed header with user info and admin controls
 * - A filter bar for searching/filtering courses
 * - Student-specific toggle tabs for course type
 */
const HeaderLayout = () => {
    const { catalogue } = useCatalogueContext();
    const {currentRole} = useAuth();
    const { filters, setFilters, courseTypeFilter, setCourseTypeFilter } = catalogue;
    const location = useLocation(); // getting current path

    const showFilterBar =
        location.pathname.startsWith('/admin/courses') ||
        location.pathname === '/student-catalogue';

    return (
        <>
            <Header />

            <div className={styles.belowHeader}>
                <AdminSubMenu />
                {/* Show filter bar only for students or only on course page for admins */}
                {showFilterBar && (
                    <FilterBar filters={filters} setFilters={setFilters} />
                )}

            </div>
        </>
    );
};

export default HeaderLayout;
