/**
 * SidebarMenu.jsx
 *
 * This component renders the sidebar navigation menu for the app.
 * It shows links to different pages depending on the user's role.
 *
 * Data and functionality overview:
 * - Uses `useAuth` to get the current user's role.
 * - Displays navigation links using `NavLink` from react-router-dom.
 * - Applies active styles to the currently selected page link.
 */

import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./SidebarMenu.module.css";
import { useAuth } from '../context/AuthContext.jsx';

/**
 * SidebarMenu component renders a navigation sidebar with links.
 *
 * @returns {JSX.Element} Sidebar menu with navigation links.
 */
export default function SidebarMenu() {
    // Get user role from authentication context
    const { role } = useAuth();

    return (
        <div className={styles.sidebar}>
            {/* Sidebar title */}
            <h2 className={styles.title}>Menu</h2>

            {/* Link to Course Catalogue page */}
            <NavLink
                to="/catalogue"
                // Apply active styles when this route is active
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Course Catalogue
            </NavLink>

            {/* Link to Course Form page */}
            <NavLink
                to="/form"
                // Apply active styles when this route is active
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Course Form
            </NavLink>
        </div>
    );
}
