// src/pages/AdminSemestersPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import {
    saveSemesterInfo,
    isSemesterExists,
    getSemesterInfo,
} from '../api/functions_for_semesters.js';
import { uniquePrograms, fetchCourses } from '../api/functions_for_courses.js';

const LS_KEY = 'semesterFormData';

/**
 * AdminSemestersPage
 *
 * Provides an interface for admins to create or edit semester configurations:
 * - Semester term (Fall/Spring/Summer)
 * - Academic year
 * - Applicable programs
 * - Courses available for selected programs
 * - Deadline
 * - Active/inactive toggle
 *
 * Features:
 * - Auto-saves form draft to localStorage on every change
 * - On first manual change of term or year, detects existing record in DB
 *   and prompts the user to load it
 * - Immediate backend update when toggling active/inactive
 * - Full insert/update on form submission, with validation
 *
 * @component
 * @returns {JSX.Element}
 */
export default function AdminSemestersPage() {
    // Lazy initialize from localStorage or defaults
    const draft = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

    const [semester, setSemester] = useState(() => draft.semester || 'Fall');
    const [year, setYear] = useState(
        () => draft.year || new Date().getFullYear()
    );
    const [selectedPrograms, setSelectedPrograms] = useState(
        () => draft.selectedPrograms || []
    );
    const [selectedCourses, setSelectedCourses] = useState(
        () => draft.selectedCourses || []
    );
    const [deadline, setDeadline] = useState(() => draft.deadline || '');
    const [isActive, setIsActive] = useState(() => draft.isActive ?? false);

    const [programs, setPrograms] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    // Tracks first render of semester/year change
    const firstCheck = useRef(true);

    /**
     * Load the list of unique academic programs once.
     */
    useEffect(() => {
        uniquePrograms().then(setPrograms).catch(console.error);
    }, []);

    /**
     * Whenever selectedPrograms changes, fetch the matching courses.
     * Clears selections if no programs selected.
     */
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

    /**
     * Auto-save the current form state into localStorage on any field change.
     */
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
    }, [
        semester,
        year,
        selectedPrograms,
        selectedCourses,
        deadline,
        isActive,
    ]);

    /**
     * On the first manual change of semester or year, check the database
     * for existing data and prompt the user once to load it.
     */
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

    /**
     * Toggle the active status immediately on the backend.
     * @async
     */
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

    /**
     * Validate and save the full semester form (insert or update).
     * @param {React.FormEvent} e
     * @async
     */
    const handleSave = async (e) => {
        e.preventDefault();

        // Simple validation
        if (
            !semester ||
            !year ||
            !selectedPrograms.length ||
            !selectedCourses.length ||
            !deadline
        ) {
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
        <form onSubmit={handleSave} style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>Semester Setup</h2>

            <label>
                Semester:
                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                >
                    {['Fall', 'Spring', 'Summer'].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Year:
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(+e.target.value)}
                />
            </label>

            <label>
                Programs:
                <Select
                    isMulti
                    options={programs.map((p) => ({ label: p, value: p }))}
                    value={selectedPrograms.map((p) => ({ label: p, value: p }))}
                    onChange={(sel) => setSelectedPrograms(sel.map((x) => x.value))}
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
                />
            </label>

            <label>
                Deadline:
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
            </label>

            <div style={{ margin: '16px 0' }}>
                <button
                    type="button"
                    onClick={handleToggleActive}
                    style={{
                        padding: '8px 16px',
                        background: isActive ? '#4caf50' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                    }}
                >
                    {isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>

            <button
                type="submit"
                style={{
                    padding: '10px 20px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                Save
            </button>
        </form>
    );
}
