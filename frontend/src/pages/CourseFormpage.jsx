    import { useState } from 'react';
    import SidebarMenu from '../components/SidebarMenu.jsx';
    import ElectivesForm from "../components/ElectivesForm.jsx";
    import { useAuth } from "../context/AuthContext.jsx";
    import styles from './CourseFormpage.module.css';
    import Header from "../components/Header.jsx";

    import { useExcelExport } from '../hooks/useExcelExport';
    import { useFormSubmit } from '../hooks/useFormSubmit';

    import {getUserProgram} from "../api/functions_for_users.js";
    import {getProgramInfo} from "../api/functions_for_programs.js";

    export default function CourseFormPage() {
        const { email, role } = useAuth();
        console.log('Current email in CourseFormPage:', email);
        const [activeTab, setActiveTab] = useState('tech');

        const { isExported, exportToExcel } = useExcelExport();
        const { onSubmit } = useFormSubmit(email);

        return (
            <>
                <Header />
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

                        {role === 'admin' && (
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={exportToExcel}
                                    className={styles.resultsButton}
                                >
                                    {isExported ? 'Exported!' : 'Export to Excel'}
                                </button>
                            </div>
                        )}
                        {role !== 'admin' && (
                            <ElectivesForm
                                type={activeTab}
                                onSubmit={(selectedCourses) => onSubmit(selectedCourses, activeTab)}
                            />
                        )}
                        </div>
                </div>
            </>
        );
    }
