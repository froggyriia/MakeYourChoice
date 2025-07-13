import React, { useEffect, useState } from 'react';
import SemesterList from '../components/SemesterList';
import SemesterForm from '../components/SemesterForm';
import { getAllSemesters } from '../api/functions_for_semesters.js';
import styles from './AdminSemestersPage.module.css';

export default function AdminSemestersPage() {
    const [semesters, setSemesters] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // load all semesters on mount
    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        const all = await getAllSemesters();
        setSemesters(all);
    }

    const handleSelect = id => setEditingId(id);
    const handleEdit   = id => setEditingId(id);
    const handleDelete = async id => {
        // your delete logic here...
        await refresh();
        if (id === editingId) setEditingId(null);
    }

    const handleSaved = async sem => {
        await refresh();
        setEditingId(sem.id);
    }

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <button
                    className={styles.addButton}
                    onClick={() =>
                    {setEditingId(null)
                        console.log("add new semester")}
                }
                >
                    + Add new semester
                </button>
                <SemesterList
                    semesters={semesters}
                    onSelect={handleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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
