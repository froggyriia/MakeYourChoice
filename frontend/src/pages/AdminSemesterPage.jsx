import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import {
    saveSemesterInfo,
    isSemesterExists,
    getSemesterInfo,
} from '../api/functions_for_semesters.js';
import { uniquePrograms, fetchCourses } from '../api/functions_for_courses.js';
import styles from './AdminSemestersPage.module.css';

const LS_KEY = 'semesterFormData';

export default function AdminSemestersPage() {
    const draft = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

    const [semester, setSemester] = useState(() => draft.semester || 'Fall');
    const [year, setYear] = useState(() => draft.year || new Date().getFullYear());
    const [selectedPrograms, setSelectedPrograms] = useState(() => draft.selectedPrograms || []);
    const [selectedCourses, setSelectedCourses] = useState(() => draft.selectedCourses || []);
    const [deadline, setDeadline] = useState(() => draft.deadline || '');
    const [isActive, setIsActive] = useState(() => draft.isActive ?? false);

    const [programs, setPrograms] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const firstCheck = useRef(true);

    useEffect(() => {
        uniquePrograms().then(setPrograms).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedPrograms.length > 0) {
            fetchCourses(null, true, { programs: selectedPrograms })
                .then(setAvailableCourses)
                .catch(console.error);
        } else {
            setAvailableCourses([]);
            setSelectedCourses([]);
        }
    }, [selectedPrograms]);

    console.log('courses:', selectedCourses);
    useEffect(() => {
        const draftState = {
            semester,
            year,
            selectedPrograms,
            selectedCourses,
            deadline,
            isActive,
        };
        localStorage.setItem(LS_KEY, JSON.stringify(draftState));
    }, [semester, year, selectedPrograms, selectedCourses, deadline, isActive]);

    useEffect(() => {
        if (firstCheck.current) {
            firstCheck.current = false;
            return;
        }

        (async () => {
            try {
                const exists = await isSemesterExists(semester, year);
                if (!exists) return;

                const load = window.confirm(
                    `You already have information about ${semester} ${year} saved.\n` +
                    'Load it for editing?'
                );
                if (!load) return;

                const data = await getSemesterInfo({
                    semester,
                    semester_year: year,
                });

                if (data?.length) {
                    const sem = data[0];
                    setSelectedPrograms(sem.program);
                    setSelectedCourses(sem.courses);
                    setDeadline(sem.deadline?.split('T')[0] || '');
                    setIsActive(sem.is_active);
                }
            } catch (err) {
                console.error('Error checking/loading semester:', err);
            }
        })();
    }, [semester, year]);

    const handleToggleActive = async () => {
        const newActive = !isActive;
        try {
            await saveSemesterInfo({
                semester,
                semester_year: year,
                program: selectedPrograms,
                courses: selectedCourses,
                deadline,
                is_active: newActive,
            });
            setIsActive(newActive);
            alert(`Semester is now ${newActive ? 'Active' : 'Inactive'}.`);
        } catch (err) {
            console.error('Failed to update active status:', err);
            alert('Failed to update active status.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!semester || !year || !selectedPrograms.length || !selectedCourses.length || !deadline) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            await saveSemesterInfo({
                semester,
                semester_year: year,
                program: selectedPrograms,
                courses: selectedCourses,
                deadline,
                is_active: isActive,
            });
            localStorage.removeItem(LS_KEY);
            alert('Semester saved successfully.');
        } catch (err) {
            console.error('Error saving semester:', err);
            alert('Error saving semester.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Semester Setup</h2>
            
            <form onSubmit={handleSave} className={styles.form}>
                <label>
                    Semester:
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className={styles.select}
                    >
                        {['Fall', 'Spring', 'Summer'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Year:
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(+e.target.value)}
                        className={styles.input}
                    />
                </label>

                <label>
                    Programs:
                    <Select
                        isMulti
                        options={programs.map((p) => ({ label: p, value: p }))}
                        value={selectedPrograms.map((p) => ({ label: p, value: p }))}
                        onChange={(sel) => setSelectedPrograms(sel.map((x) => x.value))}
                        className={styles.reactSelect}
                        classNamePrefix="reactSelect"
                    />
                </label>

                <label>
                    Available Courses:
                    <Select
                        isMulti
                        options={availableCourses.map((c) => ({
                            label: c.title,
                            value: c.title,
                        }))}
                        value={selectedCourses.map((t) => ({ label: t, value: t }))}
                        onChange={(sel) => setSelectedCourses(sel.map((x) => x.value))}
                        className={styles.reactSelect}
                        classNamePrefix="reactSelect"
                    />
                </label>

                <label>
                    Deadline:
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={styles.input}
                    />
                </label>

                <div className={styles.buttonsContainer}>
                    <button
                        type="submit"
                        className={styles.saveButton}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleToggleActive}
                        className={`${styles.toggleButton} ${isActive ? styles.active : ''}`}
                    >
                        {isActive ? 'Activate' : 'Deactivate'}
                    </button>
                </div>
            </form>
        </div>
    );
}