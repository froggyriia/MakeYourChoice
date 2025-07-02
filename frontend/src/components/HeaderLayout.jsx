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
import {useLocation} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

/**
 * Layout component that renders:
 * - A fixed header with user info and admin controls
 * - A filter bar for searching/filtering courses
 * - Student-specific toggle tabs for course type
 */
const HeaderLayout = () => {
    const location = useLocation();
    const { catalogue } = useCatalogueContext();
    const {currentRole} = useAuth();
    const { filters, setFilters, courseTypeFilter, setCourseTypeFilter } = catalogue;
    const hideFilterBar =
        currentRole === 'admin' && location.pathname === '/admin/programs';

    // console.log(location.pathname, hideFilterBar, currentRole);
    return (
        <>
            <Header /> {/* Top fixed header */}

            {/* Section below header: filter bar + student tabs */}
            <div className={styles.belowHeader}>
                {/* Filters for programs, language, year, etc. */}
                {!hideFilterBar && <FilterBar filters={filters} setFilters={setFilters} />}
            </div>
        </>
    );
};

export default HeaderLayout;
