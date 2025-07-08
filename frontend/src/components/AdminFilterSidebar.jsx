import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './AdminFilterSidebar.module.css';
import { uniquePrograms } from '../api/functions_for_courses.js';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

const AdminFilterSidebar = ({ filters, setFilters }) => {
    const [programOptions, setProgramOptions] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
    const { viewMode, setViewMode } = useCatalogueContext().catalogue;

    useEffect(() => {
        const fetchPrograms = async () => {
            setIsLoadingPrograms(true);
            try {
                const programs = await uniquePrograms();
                setProgramOptions(programs.map(p => ({ value: p, label: p })));
            } catch (err) {
                console.error("Program loading failed", err);
            } finally {
                setIsLoadingPrograms(false);
            }
        };
        fetchPrograms();
    }, []);

    const toggleFilter = (category, value) => {
        setFilters((prev) => {
            const current = prev[category] || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const handleReset = () => {
        setFilters({
            programs: [],
            years: [],
            types: [],
            languages: [],
            isArchived: false
        });
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h3>Filters</h3>
                <button
                    className={styles.resetButton}
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            {/* Program filter */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Program</span>
                <Select
                    isMulti
                    isLoading={isLoadingPrograms}
                    options={programOptions}
                    value={(filters.programs || []).map(p => ({ value: p, label: p }))}
                    onChange={(selected) => {
                        const values = selected?.map(s => s.value) || [];
                        setFilters((prev) => ({ ...prev, programs: values }));
                    }}
                    classNamePrefix="select"
                />
            </div>

            {/* Year filter */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Year</span>
                <Select
                    isMulti
                    options={[
                        { value: 'BS1', label: 'BS1' },
                        { value: 'BS2', label: 'BS2' },
                        { value: 'BS3', label: 'BS3' },
                        { value: 'BS4', label: 'BS4' },
                        { value: 'MS1', label: 'MS1' },
                        { value: 'MS2', label: 'MS2' },
                        { value: 'PhD1', label: 'PhD1' },
                        { value: 'PhD2', label: 'PhD2' },
                    ]}
                    value={(filters.years || []).map((y) => ({ value: y, label: y }))}
                    onChange={(selected) => {
                        const values = selected?.map((s) => s.value) || [];
                        setFilters((prev) => ({ ...prev, years: values }));
                    }}
                    placeholder="Select..."
                    classNamePrefix="select"
                />
            </div>

            {/* Type filter */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Type</span>
                <div className={styles.buttonGroup}>
                    {['tech', 'hum'].map((type) => (
                        <button
                            key={type}
                            className={`${styles.filterButton} ${filters.types?.includes(type) ? styles.active : ''}`}
                            onClick={() => toggleFilter('types', type)}
                        >
                            {type === 'tech' ? 'Technical' : 'Humanities'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Language filter */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Language</span>
                <div className={styles.buttonGroup}>
                    {['Eng', 'Rus'].map((lang) => (
                        <button
                            key={lang}
                            className={`${styles.filterButton} ${filters.languages?.includes(lang) ? styles.active : ''}`}
                            onClick={() => toggleFilter('languages', lang)}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status filter */}
            <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Status</span>
                <div className={styles.buttonGroup}>
                    <button
                        className={`btn-sm ${filters.isArchived === false ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({
                            ...prev,
                            isArchived: prev.isArchived === false ? undefined : false
                        }))}
                    >
                        Active
                    </button>
                    <button
                        className={`btn-sm ${filters.isArchived === true ? 'active' : ''}`}
                        onClick={() => setFilters(prev => ({
                            ...prev,
                            isArchived: prev.isArchived === true ? undefined : true
                        }))}
                    >
                        Archived
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminFilterSidebar;
