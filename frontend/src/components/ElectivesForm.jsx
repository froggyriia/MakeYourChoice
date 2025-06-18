import React, { useState, useEffect } from "react";
import styles from './ElectivesForm.module.css';
import { fetchCourses } from '../api/functions_for_courses';

export default function ElectivesForm({ type, onSubmit }) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(""));

    useEffect(() => {
        setSelectedCourses(Array(5).fill(""));

        const loadCourses = async () => {
            try {
                setLoading(true);
                const allCourses = await fetchCourses();
                const filtered = allCourses.filter(course => course.type === type);
                setFilteredCourses(filtered);
            } catch (err) {
                setError(err.message);
                console.error('Error loading courses:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, [type]);

    const handleChange = (index, value) => {
        const updated = [...selectedCourses];
        updated[index] = value;
        setSelectedCourses(updated);
    };

    const handleClear = () => {
        setSelectedCourses(Array(5).fill(""));
    };

    if (loading) {
        return <div className={styles.loading}>Loading courses...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(selectedCourses, type);
                }}
                className={styles.form}
            >
                {[...Array(5)].map((_, i) => {
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
                                required
                            >
                                <option value="" disabled>
                                    Select course
                                </option>
                                {availableCourses.map(course => (
                                    <option key={course.id} value={course.title}>
                                        {course.title} ({course.teacher})
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                })}

                <div className={styles.buttonsRow}>
                    <button type="submit" className={styles.submitButton}>
                        Submit Preferences
                    </button>
                    <button 
                        type="button" 
                        className={styles.clearButton} 
                        onClick={handleClear}
                    >
                        Clear All
                    </button>
                </div>
            </form>
        </div>
    );
}