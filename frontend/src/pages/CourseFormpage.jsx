import { useState, useEffect } from 'react';
import SidebarMenu from '../components/SidebarMenu.jsx';
import ElectivesForm from "../components/ElectivesForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from './CourseFormPage.module.css';
import { supabase } from './supabaseClient.jsx';
import Header from "../components/Header.jsx";
import { fetchCourses } from '../api/functions_for_courses.js';

export default function CourseFormPage() {
    const { email, role } = useAuth();
    const [activeTab, setActiveTab] = useState('tech');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await fetchCourses();
                setCourses(data || []);
            } catch (error) {
                console.error('Ошибка загрузки курсов:', error.message);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const onSubmit = async (selectedCourseIds) => {
        if (loading || submitLoading) return;

        setSubmitLoading(true);

        try {
            const trimmed = selectedCourseIds.slice(0, 5);

            const selectedCourseTitles = trimmed.map(id => {
                const course = courses.find(c => String(c.id) === String(id));
                return course?.title || '';
            });

            const fieldPrefix = activeTab === 'tech' ? 'tecn' : 'hum';
            const operationData = {
                email,
                created_at: new Date().toISOString(),
                ...selectedCourseTitles.reduce((acc, title, index) => {
                    acc[`${fieldPrefix}${index + 1}`] = title;
                    return acc;
                }, {})
            };

            const { data: existing } = await supabase
                .from('priorities')
                .select('*')
                .eq('email', email)
                .single();

            const { error } = existing
                ? await supabase
                    .from('priorities')
                    .update(operationData)
                    .eq('email', email)
                : await supabase
                    .from('priorities')
                    .insert([operationData]);

            if (error) throw error;
            alert('Данные успешно сохранены!');

        } catch (error) {
            console.error('Ошибка сохранения:', error.message);
            alert('Произошла ошибка при сохранении');
        } finally {
            setSubmitLoading(false);
        }
    };

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
        </>

    );
}
