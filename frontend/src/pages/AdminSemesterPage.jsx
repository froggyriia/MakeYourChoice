import React, { useEffect, useState } from 'react';
import SemesterTile from '../components/SemesterTile';
import SemesterForm from '../components/SemesterForm';
import { getAllSemesters, deleteSemester } from '../api/functions_for_semesters.js';
import { useExcelExport } from '../hooks/useExcelExport';
import styles from './AdminSemestersPage.module.css';

export default function AdminSemestersPage() {
    const [semesters, setSemesters] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const { exportToExcel } = useExcelExport();

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        const all = await getAllSemesters();
        setSemesters(all);
    }

    const handleSelect = id => setEditingId(id);
    const handleEdit = id => setEditingId(id);

    const handleDelete = async id => {

        setSemesters(prev => prev.filter(s => s.id !== id));


        if (id === editingId) setEditingId(null);

        try {
            await deleteSemester(id);
        } catch (err) {
            console.error('Ошибка при удалении:', err);
            alert('Не удалось удалить семестр. Попробуйте еще раз.');
            // Восстанавливаем список (откат)
            await refresh();
        }
    };

    const handleSaved = async sem => {
        await refresh();
        setEditingId(sem.id);
    };

    const handleExport = async (semesterId) => {
    try {
        await exportToExcel(semesterId);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Export failed: " + error.message);
    }
};
    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <button
                    className={styles.addButton}
                    onClick={() => setEditingId(null)}
                >
                    + Add new semester
                </button>

                {semesters.map(semester => (
                    <SemesterTile
                        key={semester.id}
                        semester={semester}
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onExport={handleExport}
                    />
                ))}
            </aside>

            <main className={styles.content}>
                <SemesterForm
                    semesterId={editingId}
                    onSave={handleSaved}
                />
            </main>
        </div>
    );
}