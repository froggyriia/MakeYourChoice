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

// src/pages/AdminCataloguePage.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderLayout from '../components/HeaderLayout';
import styles from './CataloguePage.module.css';

export default function AdminCataloguePage() {
    return (
        <>
            <HeaderLayout />

            <div className={styles.adminPageWrapper}>
                {/* Only one content column now */}
                <div className={styles.adminMainContent}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
