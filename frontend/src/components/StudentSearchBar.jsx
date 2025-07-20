import React, { useEffect, useState } from 'react';
import { useCatalogueContext } from '../context/CatalogueContext';
import { searchCoursesByTitle } from '../api/function_for_search';
import { fetchCourses } from '../api/functions_for_courses';
import styles from './FilterHeader.module.css';
import { useAuth } from '../context/AuthContext.jsx';

const StudentSearchBar = () => {
    const [searchText, setSearchText] = useState('');
    const { catalogue } = useCatalogueContext();
    const { setCourses, email } = catalogue;
    const { currentRole, email, currentSemId } = useAuth();

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            try {
                if (searchText.trim().length >= 3) {
                    const results = await searchCoursesByTitle(searchText, catalogue.courses);
                    setCourses(results);
                } else if (searchText.trim() === '') {
                    const allCourses = await fetchCourses(email, false, currentSemId); // student mode
                    setCourses(allCourses);
                }
            } catch (err) {
                console.error('Search failed:', err);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    return (
        <div className={styles.filterHeader}>
            <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={styles.searchInput}
            />
        </div>
    );
};

export default StudentSearchBar;
