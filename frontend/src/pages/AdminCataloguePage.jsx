/**
 * AdminCataloguePage
 *
 * This page provides the administrative interface for managing:
 * - The course catalogue (create, edit, delete courses)
 * - Student programs (add/edit/delete groups of programs)
 *
 * Only accessible by users with an 'admin' role.
 * Includes modals for course/program management, along with dynamic listings.
 */

import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderLayout from '../components/HeaderLayout';
import SidebarMenu from '../components/SidebarMenu';
import styles from './CataloguePage.module.css';
import { useAuth } from '../context/AuthContext';

const AdminCataloguePage = () => {
    const { role } = useAuth();

    return (
        <>
            <HeaderLayout />

            <div className={styles.adminPageWrapper}>
                {/* Sidebar */}
                <div className={styles.adminSidebar}>
                    <SidebarMenu />
                </div>

                {/* Dynamic page based on route */}
                <div className={styles.adminMainContent}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminCataloguePage;
