import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./SidebarMenu.module.css";
import { useAuth } from '../context/AuthContext';

export default function SidebarMenu() {
    const { currentRole } = useAuth();

    // Показывать меню только если пользователь — админ
    if (currentRole !== 'admin') return null;

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Menu</h2>

            <NavLink
                to="/admin/courses"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Electives (Courses)
            </NavLink>

            <NavLink
                to="/admin/programs"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Student Programs
            </NavLink>

            <NavLink
                to="/admin/semesters"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Semesters
            </NavLink>

        </div>
    );
}
