import { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu.jsx';
import ElectivesForm from "../components/ElectivesForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from './CourseFormPage.module.css';
import { supabase } from './supabaseClient.jsx';
import Header from "../components/Header.jsx";
import mockCourses from '../utils/fakeCoursesDB.js';

export default function CourseFormPage() {
    const { email, role } = useAuth();  // получили роль из контекста
    const [activeTab, setActiveTab] = useState('tech');

   const onSubmit = async (selectedCourseIds) => {
    const trimmed = selectedCourseIds.slice(0, 5);

    // Находим названия по ID
    const selectedCourseTitles = trimmed.map(id => {
        const course = mockCourses.find(c => String(c.id) === String(id));
        return course ? course.title : '';
    });

    const fieldPrefix = activeTab === 'tech' ? 'tecn' : 'hum';
    const insertData = {
        email,
        created_at: new Date().toISOString()
    };

    selectedCourseTitles.forEach((title, index) => {
        insertData[`${fieldPrefix}${index + 1}`] = title;
    });

    // Проверка на существование записи
    const { data: existing, error: fetchError } = await supabase
        .from('priorities')
        .select('*')
        .eq('email', email)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Ошибка при получении:', fetchError.message);
        return;
    }

    if (existing) {
        const updateData = {};
        selectedCourseTitles.forEach((title, index) => {
            updateData[`${fieldPrefix}${index + 1}`] = title;
        });

        const { error: updateError } = await supabase
            .from('priorities')
            .update(updateData)
            .eq('email', email);

        if (updateError) {
            console.error('Ошибка при обновлении:', updateError.message);
        } else {
            console.log('Успешно обновлено.');
        }
    } else {
        const { error: insertError } = await supabase
            .from('priorities')
            .insert([insertData]); // вставка массива объектов

        if (insertError) {
            console.error('Ошибка при вставке:', insertError.message);
        } else {
            console.log('Успешно добавлено.');
        }
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
