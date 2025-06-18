import React, { useState, useEffect } from "react";
import styles from './ElectivesForm.module.css';
import { fetchCourses } from '../api/functions_for_courses';
import { useAuth } from '../context/AuthContext'

export default function ElectivesForm({ type, onSubmit, onClear }) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(""));

    const { email } = useAuth();

    useEffect(() => {
        setSelectedCourses(Array(5).fill(""));

        const loadCourses = async () => {
            try {
                setLoading(true);
                const allCourses = await fetchCourses(email);
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
        if (onClear) onClear(type); // Передаем тип вкладки
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(selectedCourses, type); // Передаем type как activeTab
                    }}
                    className={styles.form}
                >
                    <h2>{type === 'tech' ? 'Technical Electives' : 'Humanities Electives'}</h2>

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
                                >
                                    <option value="" disabled>
                                        Select course
                                    </option>
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
            </div>
        </div>
    );
}
