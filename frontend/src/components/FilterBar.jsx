import React from 'react';
import styles from './FilterBar.module.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

/**
 * Student-only FilterBar component.
 * Allows toggling course type (tech/hum) and language.
 */
const FilterBar = ({ filters = {}, setFilters }) => {
    const { currentRole } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { courseTypeFilter, setCourseTypeFilter } = catalogue;

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
        </div>
    );
};

export default FilterBar;
