// src/components/SemesterForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import {
    saveSemesterInfo,
    getLatestRecordBySemester,
    getSemesterById
} from '../api/functions_for_semesters.js';
import { uniquePrograms, fetchCourses } from '../api/functions_for_courses.js';
import styles from './SemesterForm.module.css';

const LS_KEY = 'semesterFormData';

/**
 * @component
 * @description
 * A form for creating or editing a semester.
 * - Auto-loads draft from localStorage on mount
 * - Any change to fields is saved back to localStorage
 * - Whenever the “Season” (Fall/Spring/Summer) dropdown changes,
 *   automatically pulls the most recent record of that season from the DB
 *   (via getLatestRecordBySemester) and pre-fills the form.
 * - “Save” inserts or updates the semester in the DB.
 * - “Activate/Deactivate” immediately toggles is_active in the DB and the UI.
 */
export default function SemesterForm({ semesterId, onSave }) {
    // 1️⃣ Lazy‐load draft from localStorage
    const draft = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

    const [season, setSeason] = useState(() => draft.season || 'Fall');
    const [year, setYear] = useState(() => draft.year || new Date().getFullYear());
    const [selectedPrograms, setSelectedPrograms] = useState(() => draft.selectedPrograms || []);
    const [selectedCourses, setSelectedCourses] = useState(() => draft.selectedCourses || []);
    const [deadline, setDeadline] = useState(() => draft.deadline || '');
    const [isActive, setIsActive] = useState(() => draft.isActive ?? false);

    const [programs, setPrograms] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    // skip initial season-load
    const skipFirstSeasonLoad = useRef(true);

    // ─── load all programs once ─────────────────────────────────────────
    useEffect(() => {
        uniquePrograms()
            .then(setPrograms)
            .catch(console.error);
    }, []);
    useEffect(() => {
        if (!semesterId) return;
        (async () => {
            try {
                const sem = await getSemesterById(semesterId);
                // seed your form state:
                setSeason(sem.semester);
                setYear(sem.semester_year);
                setSelectedPrograms(sem.program);
                setSelectedCourses(sem.courses);
                setDeadline(sem.deadline?.split('T')[0] || '');
                setIsActive(!!sem.is_active);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [semesterId]);
    // ─── when selectedPrograms changes ─────────────────────────────────
    useEffect(() => {
        if (selectedPrograms.length) {
            fetchCourses(null, true, { programs: selectedPrograms })
                .then(setAvailableCourses)
                .catch(console.error);
        } else {
            setAvailableCourses([]);
            setSelectedCourses([]);
        }
    }, [selectedPrograms]);

    // ─── persist draft on every field change ───────────────────────────
    useEffect(() => {
        const toSave = {
            season,
            year,
            selectedPrograms,
            selectedCourses,
            deadline,
            isActive,
        };
        localStorage.setItem(LS_KEY, JSON.stringify(toSave));
    }, [season, year, selectedPrograms, selectedCourses, deadline, isActive]);

    // ─── whenever season changes (after mount), auto‐load latest record ─
    useEffect(() => {
        if (skipFirstSeasonLoad.current) {
            skipFirstSeasonLoad.current = false;
            return;
        }

        (async () => {
            try {
                const last = await getLatestRecordBySemester(season);
                if (!last) return;

                setYear(last.semester_year);
                setSelectedPrograms(last.program);
                setSelectedCourses(last.courses);
                setDeadline(last.deadline?.split('T')[0] || '');
                setIsActive(!!last.is_active);
            } catch (err) {
                console.error('Failed to load latest semester record:', err);
            }
        })();
    }, [season]);

    // ─── toggle active/inactive immediately ────────────────────────────
    const handleToggleActive = async () => {
        try {
            await saveSemesterInfo({
                semester: season,
                semester_year: year,
                program: selectedPrograms,
                courses: selectedCourses,
                deadline,
                is_active: !isActive,
            });
            setIsActive(a => !a);
        } catch (err) {
            console.error('Error toggling active status:', err);
        }
    };

    // ─── full save handler ──────────────────────────────────────────────
    const handleSave = async e => {
        e.preventDefault();
        if (!season || !year || !selectedPrograms.length || !selectedCourses.length || !deadline) {
            return; // you could show inline validation messages here
        }
        try {
            await saveSemesterInfo({
                semester: season,
                semester_year: year,
                program: selectedPrograms,
                courses: selectedCourses,
                deadline,
                is_active: isActive,
            });
            localStorage.removeItem(LS_KEY);
        } catch (err) {
            console.error('Error saving semester:', err);
        }
    };

    return (
        <form onSubmit={handleSave} className={styles.form}>
            <label className={styles.field}>
                <span>Season:</span>
                <select
                    className={styles.select}
                    value={season}
                    onChange={e => setSeason(e.target.value)}
                >
                    {['Fall', 'Spring', 'Summer'].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </label>

            <label className={styles.field}>
                <span>Year:</span>
                <input
                    type="number"
                    className={styles.input}
                    value={year}
                    onChange={e => setYear(+e.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>Programs:</span>
                <Select
                    isMulti
                    className={styles.reactSelect}
                    classNamePrefix="reactSelect"
                    options={programs.map(p => ({ label: p, value: p }))}
                    value={selectedPrograms.map(p => ({ label: p, value: p }))}
                    onChange={sel => setSelectedPrograms(sel.map(x => x.value))}
                />
            </label>

            <label className={styles.field}>
                <span>Available Courses:</span>
                <Select
                    isMulti
                    className={styles.reactSelect}
                    classNamePrefix="reactSelect"
                    options={availableCourses.map(c => ({ label: c.title, value: c.id }))}
                    value={selectedCourses
                        .map(id => {
                            const c = availableCourses.find(x => x.id === id);
                            return c ? { label: c.title, value: c.id } : null;
                        })
                        .filter(Boolean)}
                    onChange={sel => setSelectedCourses(sel.map(x => x.value))}
                />
            </label>

            <label className={styles.field}>
                <span>Deadline:</span>
                <input
                    type="date"
                    className={styles.input}
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                />
            </label>

            <div className={styles.buttonsContainer}>
                <button type="submit" className={styles.saveButton}>
                    Save
                </button>
                <button
                    type="button"
                    onClick={handleToggleActive}
                    className={`${styles.toggleButton} ${isActive ? styles.active : ''}`}
                >
                    {isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </form>
    );
}
