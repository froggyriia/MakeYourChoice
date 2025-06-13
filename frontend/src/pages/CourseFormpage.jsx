import { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu.jsx';
import ElectivesForm from "../components/ElectivesForm.jsx";
import studentsPreferences from "../utils/students_pref.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from './CourseFormPage.module.css';

export default function CourseFormPage() {
    const { email, role } = useAuth();  // получили роль из контекста
    const [activeTab, setActiveTab] = useState('tech');

    const onSubmit = (selectedCourses) => {
        console.log("Submitted courses:", selectedCourses);
        let student = studentsPreferences.find(s => s.email === email);
        if (!student) {
            student = { email, hum: [], tech: [] };
            studentsPreferences.push(student);
        }
        student[activeTab] = selectedCourses;
        console.log("Updated studentsPreferences:", studentsPreferences);
    };

    const handleAdminClick = () => {
        console.log("Students preferences:", studentsPreferences);
    };

    return (
        <div className={styles.pageWrapper}>
            <SidebarMenu />
            <div className={styles.content}>
                <div className={styles.headerContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'hum' ? styles.active : styles.inactive}`}
                        onClick={() => setActiveTab('hum')}
                    >
                        Hum
                    </button>
                    <h1 className={styles.title}>Course Form</h1>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'tech' ? styles.active : styles.inactive}`}
                        onClick={() => setActiveTab('tech')}
                    >
                        Tech
                    </button>
                </div>

                {/* Кнопка для администратора */}
                {role === 'admin' && (
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <button
                            onClick={handleAdminClick}
                            className={styles.resultsButton}
                        >
                            Show All Students Preferences
                        </button>
                    </div>
                )}

                <ElectivesForm type={activeTab} onSubmit={onSubmit} />
            </div>
        </div>
    );
}
