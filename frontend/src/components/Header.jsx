// components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';

const Header = () => {
    const navigate = useNavigate();
    const { logout, email } = useAuth(); // <-- заменили user на email

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!email) return null; // Не показывать, если не залогинен

    return (
        <div className={styles.header}>
            <span>{email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log out
            </button>
        </div>
    );
};

export default Header;
