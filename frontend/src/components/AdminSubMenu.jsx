import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';

export default function AdminSubMenu() {
    const { currentRole } = useAuth();
    if (currentRole !== 'admin') return null;

    return (
        <nav className={styles.adminNav}>
            <div className={styles.adminNavContent}>
                <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                        isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn
                    }
                >
                    Courses
                </NavLink>
                <NavLink
                    to="/admin/programs"
                    className={({ isActive }) =>
                        isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn
                    }
                >
                    Programs
                </NavLink>
                <NavLink
                    to="/admin/semesters"
                    className={({ isActive }) =>
                        isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn
                    }
                >
                    Semesters
                </NavLink>
            </div>
        </nav>
    );
}