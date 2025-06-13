import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./SidebarMenu.module.css";


export default function SidebarMenu() {
    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Menu</h2>
            <NavLink
                to="/catalogue"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Course Catalogue
            </NavLink>
            <NavLink
                to="/form"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                }
            >
                Course Form
            </NavLink>
        </div>
    );
}
