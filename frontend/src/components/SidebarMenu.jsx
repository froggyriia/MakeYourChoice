import React from "react";
import { NavLink } from 'react-router-dom';
import '../styles/SideBar.css';

export default function SidebarMenu() {
    return (
        <div className="sidebar">
            <h2 className="menu-title">Menu</h2>
            <NavLink to="/catalogue" className="menu-item" activeclassname="active">Course Catalogue</NavLink>
            <NavLink to="/form" className="menu-item" activeclassname="active">Course Form</NavLink>
        </div>
    );
}
