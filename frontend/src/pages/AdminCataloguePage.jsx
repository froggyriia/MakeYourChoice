import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderLayout from '../components/HeaderLayout';
import AdminFilterHeader from '../components/AdminFilterHeader';
import AdminFilterSidebar from '../components/AdminFilterSidebar';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import styles from './CataloguePage.module.css';

export default function AdminCataloguePage() {
    const { catalogue } = useCatalogueContext();
    const { filters, setFilters } = catalogue;

    const location = useLocation();
    const isCoursePage = location.pathname.startsWith('/admin/courses');

    return (
        <>
            <HeaderLayout />

            <div className={styles.adminPageContainer}>
                <div className={styles.adminPageWrapper}>
                    {isCoursePage && (
                        <div className={styles.adminLeftColumn}>
                            <div className={styles.adminFilterHeader}>
                                <AdminFilterHeader />
                            </div>
                            <div className={styles.adminSidebar}>
                                <AdminFilterSidebar filters={filters} setFilters={setFilters} />
                            </div>
                        </div>
                    )}
                    <div className={styles.adminMainContent}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}
