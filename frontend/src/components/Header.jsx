import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';
import {getUserProgram} from "../api/functions_for_users.js";
import { getDeadlineForGroup } from '../api/functions_for_programs.js';
import {isAdmin} from "../utils/validation.js";

const Header = () => {
    const navigate = useNavigate();
    const { logout, email } = useAuth();
    const [deadline, setDeadline] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const fetchDeadline = async () => {
            if (!email) return;
            const group = await getUserProgram(email);
            console.log(group);
            if (group) {
                const deadlineTs = await getDeadlineForGroup(group);
                if (deadlineTs) {
                    const formatted = new Date(deadlineTs).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    setDeadline(formatted);
                }
            }
        };

        fetchDeadline();
    }, [email]);

    if (!email) return null;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <span className={styles.email}>{email}</span>
                {deadline && !isAdmin(email) && (
                    <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
                )}
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log out
            </button>
        </div>
    );
};

export default Header;