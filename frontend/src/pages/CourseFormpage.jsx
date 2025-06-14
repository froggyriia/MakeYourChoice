import { useState } from 'react';
import ExcelJS from 'exceljs';
import SidebarMenu from '../components/SidebarMenu.jsx';
import ElectivesForm from "../components/ElectivesForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from './CourseFormPage.module.css';
import { supabase } from './supabaseClient.jsx';
import Header from "../components/Header.jsx";

export default function CourseFormPage() {
    const [isExported, setIsExported] = useState(false);
    const [studentsPreferences, setStudentsPreferences] = useState([]); // Инициализация состояния
    const { email, role } = useAuth();
    const [activeTab, setActiveTab] = useState('tech');

    const ExcelExport = async () => {
        try {
            const {data, error} = await supabase
                .from("priorities")
                .select("*");
            if (error) throw error;
            if (!data?.length) {
                alert("Нет данных для экспорта");
                return;
            }
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Priorities")

            const headers = Object.keys(data[0])
            worksheet.addRow(headers)

            data.forEach(row => {worksheet.addRow(Object.values(row));});

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = 'priorities_export_' + new Date().toISOString().slice(0, 10) + '.xlsx';
            link.click();
            URL.revokeObjectURL(link.href);

            setIsExported(true);
            } catch (error) {
                console.error("Ошибка при экспорте:", error);
                alert("Произошла ошибка при создании файла");
            }
        }

    const onSubmit = async (selectedCourses) => {
        // Проверка выбора 5 курсов
        if (selectedCourses.some(c => !c)) {
            alert("Пожалуйста, выберите 5 курсов");
            return;
        }

        // Создаем или обновляем данные пользователя
        const currentStudent = studentsPreferences.find(s => s.email === email) || {
            email,
            hum: Array(5).fill(""),
            tech: Array(5).fill("")
        };

        const updatedStudent = {
            ...currentStudent,
            [activeTab]: selectedCourses
        };

        // Обновляем состояние
        setStudentsPreferences(prev => {
            const others = prev.filter(s => s.email !== email);
            return [...others, updatedStudent];
        });

        // Формируем данные для Supabase
        const updateFields = {};
        ["hum", "tech"].forEach(tab => {
            const courses = updatedStudent[tab] || Array(5).fill("");
            courses.forEach((course, i) => {
                updateFields[`${tab}${i + 1}`] = course || "";
            });
        });

        try {
            // Проверяем существование записи
            const { data: existing, error: selectError } = await supabase
                .from('priorities')
                .select('*')
                .eq('email', email)
                .single();

            // PGRST116 = "No rows found" ошибка
            if (selectError && selectError.code !== 'PGRST116') throw selectError;

            // Обновляем или вставляем данные
            if (existing) {
                const { error: updateError } = await supabase
                    .from('priorities')
                    .update(updateFields)
                    .eq('email', email);
                if (updateError) throw updateError;
                alert("Данные успешно обновлены!");
            } else {
                const { error: insertError } = await supabase
                    .from('priorities')
                    .insert([{ email, ...updateFields }]);
                if (insertError) throw insertError;
                alert("Данные успешно сохранены!");
            }
        } catch (error) {
            console.error("Ошибка Supabase:", error);
            alert("Ошибка при сохранении данных");
        }
    };

    const handleAdminClick = () => {
        console.log("Students preferences:", studentsPreferences);
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

                    {role === 'admin' && (
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <button
                                onClick={ExcelExport}
                                className={styles.resultsButton}
                            >
                                {isExported ? 'Exported!' : 'Export to Excel'}
                            </button>
                        </div>
                    )}

                    <ElectivesForm type={activeTab} onSubmit={onSubmit} />
                </div>
            </div>
        </>
    );
}