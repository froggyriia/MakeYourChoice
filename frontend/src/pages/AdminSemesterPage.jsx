// src/pages/AdminSemestersPage.jsx
import React, { useEffect, useState } from 'react';
import SemesterList from '../components/SemesterList';
import SemesterForm from '../components/SemesterForm';
import {
    getAllSemesters,

} from '../api/functions_for_semesters.js';
import styles from './AdminSemestersPage.module.css';

export default function AdminSemestersPage() {
    const [semesters, setSemesters] = useState([]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSemesters();
    }, []);

    async function fetchSemesters() {
        const all = await getAllSemesters();
        setSemesters(all);
    }

    const handleSelect = id => {
        setEditingId(id);
    };

    const handleEdit = id => {
        setEditingId(id);
    };

    const handleDelete = async id => {
        console.log("delete was pressed", id);
    };

    const handleSaved = async saved => {
        await fetchSemesters();
        setEditingId(saved.id);
    };

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
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
