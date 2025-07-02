/**
 * FilterBar Component
 *
 * Provides interactive filtering controls for courses with a button-based UI.
 * Features role-specific filters:
 * - Students can filter by course type (technical/humanities) using toggle buttons
 * - Admins get additional filters for programs (dropdown) and course types
 * - All users can filter by language and year through toggle buttons
 */

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './FilterBar.module.css';
import { uniquePrograms } from '../api/functions_for_courses.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

const FilterBar = ({ filters = {}, setFilters }) => {
    const [programOptions, setProgramOptions] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
    const { currentRole } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;

    /**
     * Fetches unique programs from API and formats them for dropdown options.
     * Runs once on component mount and manages loading state.
     */
    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoadingPrograms(true);
            try {
                const programs = await uniquePrograms();
                const options = programs.map(prog => ({
                    value: prog,
                    label: prog,
                }));
                console.log("[FilterBar] Loaded program options:", options);
                setProgramOptions(options);
            } catch (error) {
                console.error('Failed to load programs:', error);
            } finally {
                setIsLoadingPrograms(false);
            }
        };

        fetchPrograms();
    }, []);

    /**
     * Handles program selection changes in the multi-select dropdown.
     * Converts selected options to values array and updates filters.
     * 
     * @param {Array} selectedOptions - Array of selected option objects from React Select
     */
    const handleSelectChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFilters((prev) => {
            const newFilters = { ...prev, programs: values };
            console.log("[FilterBar] programs filter changed:", newFilters);
            return newFilters;
        });
    };

    /**
     * Toggles filter values for button-based filters (languages, years, types).
     * Adds or removes the value from the specified filter category.
     * 
     * @param {string} category - The filter category to update ('languages', 'years', etc.)
     * @param {string|number} value - The filter value to toggle
     */
    const handleButtonFilter = (category, value) => {
        setFilters((prev) => {
            const current = prev[category] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            const newFilters = { ...prev, [category]: updated };
            console.log(`[FilterBar] ${category} filter changed:`, newFilters);
            return newFilters;
        });
    };

    /**
     * Checks if a filter value is currently active in the specified category.
     * Helper function for determining button active state.
     * 
     * @param {string} category - The filter category to check
     * @param {string|number} value - The value to check for
     * @returns {boolean} True if the value is active in the category
     */
    const isActive = (category, value) => {
        return (filters[category] || []).includes(value);
    };

    return (
        <div className={styles.filterBarContainer}>
            {/* Student-specific course type filter (toggle buttons) */}
            {currentRole === 'student' && (
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Type</span>
                    <div >
                        <button
                            className={`${styles.tabButton} ${courseTypeFilter === 'tech' ? styles.active : ''}`}
                            onClick={() => setCourseTypeFilter('tech')}
                            type="button"
                        >
                            Technical
                        </button>
                        <button
                            className={`${styles.tabButton} ${courseTypeFilter === 'hum' ? styles.active : ''}`}
                            onClick={() => setCourseTypeFilter('hum')}
                            type="button"
                        >
                            Humanities
                        </button>
                    </div>
                </div>
            )}

            {/* Admin-specific filters */}
            {currentRole === "admin" && (
                <>
                    {/* Program multi-select dropdown filter */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Program</span>
                        <Select
                            isMulti
                            isLoading={isLoadingPrograms}
                            name="programs"
                            options={programOptions}
                            value={(filters.programs || []).map(value => ({
                                value,
                                label: value,
                            }))}
                            onChange={handleSelectChange}
                            className={styles.reactSelect}
                            classNamePrefix="select"
                            placeholder={isLoadingPrograms ? "Loading..." : "Select programs..."}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({ ...base, zIndex: 9999 }),
                            }}
                        />
                    </div>

                    {/* Admin course type filter (toggle buttons) */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Type</span>
                        {['tech', 'hum'].map((type) => (
                            <button
                                key={type}
                                className={`${styles.filterButton} ${isActive('types', type) ? styles.active : ''}`}
                                onClick={() => handleButtonFilter('types', type)}
                            >
                                {type === 'tech' ? 'Technical' : 'Humanities'}
                            </button>
                        ))}
                    </div>
                    {/* Admin archived filter */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Archived</span>
                        {[
                            { label: "Active", value: false },
                            { label: "Archived", value: true }
                        ].map(option => (
                            <button
                                key={option.label}
                                className={`${styles.filterButton} ${filters.isArchived === option.value ? styles.active : ''}`}
                                onClick={() =>
                                    setFilters(prev => {
                                        const newFilters = {
                                            ...prev,
                                            isArchived: option.value
                                        };
                                        console.log("[FilterBar] archived filter changed:", newFilters);
                                        return newFilters;
                                    })
                                }
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                </>
            )}

            {/* Language filter (toggle buttons) - available to all roles */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Language</span>
                {['Eng', 'Rus'].map((lang) => (
                    <button
                        key={lang}
                        className={`${styles.filterButton} ${isActive('languages', lang) ? styles.active : ''}`}
                        onClick={() => handleButtonFilter('languages', lang)}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            {/* Year filter (toggle buttons) - only for admins */}
            {currentRole === 'admin' && (
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Year</span>
                    {[1, 2, 3, 4].map((year) => (
                        <button
                            key={year}
                            className={`${styles.filterButton} ${isActive('years', year) ? styles.active : ''}`}
                            onClick={() => handleButtonFilter('years', year)}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
