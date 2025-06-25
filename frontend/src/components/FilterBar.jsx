/**
 * FilterBar Component
 *
 * This component provides filtering controls for courses based on user role.
 * Students can filter by course type (technical/humanities).
 * Admins can filter by program and course type.
 * All users can filter by language and year.
 */

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './FilterBar.module.css';
import { uniquePrograms } from '../api/functions_for_courses.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

const FilterBar = ({ filters = {}, setFilters }) => {
    const [programOptions, setProgramOptions] = useState([]);
    const { role } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;

    /**
     * Fetches a list of unique programs and maps them into options
     * for the React Select dropdown. Executes on initial mount.
     */
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const programs = await uniquePrograms();
                const options = programs.map(prog => ({
                    value: prog,
                    label: prog,
                }));
                setProgramOptions(options); // Update state with formatted options
            } catch (error) {
                console.error('Failed to load programs:', error);
            }
        };

        fetchPrograms(); // Trigger fetch on component mount
    }, []);

    /**
     * Handles changes from the multi-select dropdown (for program filter).
     * Updates the `programs` field in the filter state.
     *
     * @param {Array} selectedOptions - Selected options from React Select
     */
    const handleSelectChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFilters((prev) => ({ ...prev, programs: values }));
    };

    /**
     * Handles checkbox changes for multi-category filters like languages and years.
     * Adds or removes the selected value from the filter state.
     *
     * @param {string} category - Filter category ('languages', 'years', etc.)
     * @param {string|number} value - The value to add/remove
     */
    const handleCheckboxChange = (category, value) => {
        setFilters((prev) => {
            const current = prev[category] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            console.log(updated)
            return { ...prev, [category]: updated };
        });
    };

    return (
        <div className={styles.filterBarContainer}>
            {/* Filter by type (for students only) */}
            {role === 'student' && (
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Type</span>
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
                </div>
            )}

            {/* Admin-specific program and type filters */}
            {role === "admin" && (
                <>
                    {/* Program multi-select filter */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Program</span>
                        <Select
                            isMulti
                            name="programs"
                            options={programOptions}
                            value={(filters.programs || []).map(value => ({
                                value,
                                label: value,
                            }))}
                            onChange={handleSelectChange}
                            className={styles.reactSelect}
                            classNamePrefix="select"
                            placeholder="Select programs..."
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.body}
                        />
                    </div>

                    {/* Admin-specific course type checkboxes */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Type</span>
                        {['tech', 'hum'].map((type) => (
                            <label key={type} className={styles.filterCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={(filters.types || []).includes(type)}
                                    onChange={() => handleCheckboxChange('types', type)}
                                />
                                {type === 'tech' ? 'Technical' : 'Humanities'}
                            </label>
                        ))}
                    </div>

                </>
            )}

            {/* Language checkboxes */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Language</span>
                {['Eng', 'Rus'].map((lang) => (
                    <label key={lang} className={styles.filterCheckbox}>
                        <input
                            type="checkbox"
                            checked={(filters.languages || []).includes(lang)}
                            onChange={() => handleCheckboxChange('languages', lang)}
                        />
                        {lang}
                    </label>
                ))}
            </div>

            {/* Year checkboxes */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Year</span>
                {[1, 2, 3, 4].map((year) => (
                    <label key={year} className={styles.filterCheckbox}>
                        <input
                            type="checkbox"
                            checked={(filters.years || []).includes(year)}
                            onChange={() => handleCheckboxChange('years', year)}
                        />
                        {year}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
