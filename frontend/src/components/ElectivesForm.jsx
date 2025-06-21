import React, { useState, useEffect } from "react";
import styles from './ElectivesForm.module.css';
import { fetchCourses } from '../api/functions_for_courses';
import {getProgramInfo} from "../api/functions_for_programs.js";
import {useAuth} from '../context/AuthContext.jsx'

export default function ElectivesForm({ type, onSubmit, onClear }) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(""));
    const [priorityCount, setPriorityCount] = useState(0);
    const { email, role } = useAuth();

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);

                const [courses, program] = await Promise.all([
                    fetchCourses(email),
                    getProgramInfo(email)
                ]);

                console.log("Courses in elective form", courses);

                const filtered = courses.filter(course => course.type === type);
                setFilteredCourses(filtered);

                const count = type === 'tech' ? program.tech : program.hum;
                setPriorityCount(count);
                setSelectedCourses(Array(count).fill(""));
            } catch (err) {
                console.error('Error initializing form:', err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [type, email]);

    const handleChange = (index, value) => {
        const updated = [...selectedCourses];
        updated[index] = value;
        setSelectedCourses(updated);
    };

    const handleClear = () => {
        setSelectedCourses(Array(5).fill(""));
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
                            onSubmit(selectedCourses, type);
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
                                        <option value="" disabled>Select course</option>
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
