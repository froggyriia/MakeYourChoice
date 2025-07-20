/**
 * ElectivesForm.jsx
 *
 * This component displays a form allowing students to choose and submit elective courses
 * (either technical or humanities) with a defined priority. The number of priority selections
 * and available electives are fetched dynamically based on the student's program.
 */

import React, { useState, useEffect } from "react";
import styles from './ElectivesForm.module.css';
import { fetchCourses } from '../api/functions_for_courses';
import {getProgramInfo} from "../api/functions_for_programs.js";
import {useAuth} from '../context/AuthContext.jsx'

/**
 * Renders a dynamic elective course selection form.
 * Displays a dropdown for each priority level based on program data.
 *
 * @component
 * @param {Object} props
 * @param {'tech'|'hum'} props.type - Type of elective courses to display.
 * @param {Function} props.onSubmit - Callback fired on form submission with selected course titles.
 * @param {Function} props.onClear - Optional callback fired when the form is cleared.
 * @returns {JSX.Element}
 */

export default function ElectivesForm({ type, priorityCount, onSubmit, onClear }) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCourses, setSelectedCourses] = useState(Array(priorityCount).fill(""));
    const { email, currentRole, currentSemId } = useAuth();

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                const courses = await fetchCourses(email, false, currentSemId);
                const filtered = courses.filter(course => course.type === type);
                setFilteredCourses(filtered);

                const saved = localStorage.getItem(`electives-${type}`);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.length === priorityCount) {
                        setSelectedCourses(parsed);
                    } else {
                        setSelectedCourses(Array(priorityCount).fill(""));
                    }
                } else {
                    setSelectedCourses(Array(priorityCount).fill(""));
                }
            } catch (err) {
                console.error('Error initializing form:', err);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [type, email, priorityCount]);

    /**
     * Handles a change in selected course at a given priority index.
     */
    const handleChange = (index, value) => {
        const updated = [...selectedCourses];
        updated[index] = value;
        setSelectedCourses(updated);
        localStorage.setItem(`electives-${type}`, JSON.stringify(updated));
    };

    /**
     * Clears all course selections and notifies the parent component.
     */
    const handleClear = () => {
        setSelectedCourses(Array(priorityCount).fill(""));
        localStorage.removeItem(`electives-${type}`);
        if (onClear) onClear(type);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {loading ? (
                    <p>Loading...</p>
                ) : priorityCount === 0 ? (
                    <p className={styles.noCoursesMessage}>
                        No {type === 'tech' ? 'technical' : 'humanities'} elective courses are available to choose for this program.
                    </p>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit(selectedCourses, type, currentSemId);
                        }}
                        className={styles.form}
                    >
                        <h2>{type === 'tech' ? 'Technical Electives' : 'Humanities Electives'}</h2>

                        {[...Array(priorityCount)].map((_, i) => {
                            const currentValue = selectedCourses[i];
                            const usedTitles = selectedCourses.filter((_, idx) => idx !== i);

                            const availableCourses = filteredCourses.filter(course =>
                                !usedTitles.includes(course.title) || course.title === currentValue
                            );

                            return (
                                <div key={i} className={styles.field}>
                                    <label htmlFor={`priority-${i}`}>Priority {i + 1}</label>
                                    <select
                                        id={`priority-${i}`}
                                        value={currentValue}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="">Select course</option>
                                        {availableCourses.map(course => (
                                            <option key={course.id} value={course.title}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}

                        <div className={styles.buttonsRow}>
                            <button type="submit" className={styles.submitButton}>Submit</button>
                            <button type="button" className={styles.clearButton} onClick={handleClear}>
                                Clear All
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}