import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./SidebarMenu.module.css";
import { useAuth } from '../context/AuthContext';

export default function SidebarMenu() {
    const { role } = useAuth();

    // Показывать меню только если пользователь — админ
    if (role !== 'admin') return null;

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Menu</h2>

            <NavLink
                to="/admin-catalogue/courses"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Electives (Courses)
            </NavLink>

            <NavLink
                to="/admin-catalogue/programs"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Student Programs
            </NavLink>
        </div>
    );
}
