// components/Header.jsx

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Header.module.css';
import {getUserProgram} from "../api/functions_for_users.js";
import { getDeadlineForGroup } from '../api/functions_for_programs.js';
import {isAdmin} from "../utils/validation.js";
import {useExcelExport} from "../hooks/useExcelExport.js";
import { useCatalogueContext } from '../context/CatalogueContext.jsx';

const Header = () => {
    const { catalogue, programs, excelExport } = useCatalogueContext();
    const navigate = useNavigate();
    const { logout, email, role} = useAuth();
    const [deadline, setDeadline] = useState(null);
    // useExcelExport handles exporting priorities table to .xlsx
    // const { isExported, exportToExcel } = useExcelExport();
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
            {role === 'admin' && (
                <div className={styles.adminActions}>
                    <button className={styles.addCourseButton} onClick={catalogue.startAddingCourse}>
                        Add course
                    </button>
                    <button className={styles.addCourseButton} onClick={() => programs.setShowModal(true)}>
                        Add Student Program
                    </button>
                    <button onClick={excelExport.exportToExcel} className={styles.exportButton}>
                        {excelExport.isExported ? 'Exported!' : 'Export to Excel'}
                    </button>
                </div>
            )}
            <button onClick={handleLogout} className={styles.logoutButton}>
                Log out
            </button>
        </div>
    );

};

export default Header;