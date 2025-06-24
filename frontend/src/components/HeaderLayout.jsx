import React from 'react';
import Header from './Header';
import FilterBar from './FilterBar';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import styles from './Header.module.css';

const HeaderLayout = () => {
    const { catalogue } = useCatalogueContext();
    const { filters, setFilters, courseTypeFilter, setCourseTypeFilter } = catalogue;

    return (
        <>
            <Header /> {/* Fixed header */}

            {/* Non-fixed section below header */}
            <div className={styles.belowHeader}>
                <FilterBar filters={filters} setFilters={setFilters} />

                {/* Only render tabs for students */}
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
