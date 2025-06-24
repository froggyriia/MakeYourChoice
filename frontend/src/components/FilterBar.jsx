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

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const programs = await uniquePrograms();
                const options = programs.map(prog => ({
                    value: prog,
                    label: prog,
                }));
                setProgramOptions(options);
            } catch (error) {
                console.error('Failed to load programs:', error);
            }
        };

        fetchPrograms();
    }, []);

    const handleSelectChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFilters((prev) => ({ ...prev, programs: values }));
    };

    const handleCheckboxChange = (category, value) => {
        setFilters((prev) => {
            const current = prev[category] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    return (
        <div className={styles.filterBarContainer}>
            {/* Type toggle buttons (for students only) */}
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

            {/* Program filter (only for admins) */}
            {role === "admin" && (
                <>
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
                </>
            )}

            {/* Language filter */}
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

            {/* Year filter */}
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
