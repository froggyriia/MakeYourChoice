import React, { useState, useEffect } from "react";
import styles from './ElectivesForm.module.css';
import { supabase } from '../pages/supabaseClient.jsx';
import { fetchCourses } from '../api/functions_for_courses';

export default function ElectivesForm({ type, onSubmit }) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(""));

    useEffect(() => {
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

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(selectedCourses);
                    }}
                    className={styles.form}
                >
                    <h2>{type === 'tech' ? 'Technical Electives' : 'Humanities Electives'}</h2>

                    {[...Array(5)].map((_, i) => {
                        const usedCoursesIDs = selectedCourses.filter((_, idx) => i !== idx);
                        const availableCourses = filteredCourses.filter(
                            course => !usedCoursesIDs.includes(String(course.id))
                        );

                        return (
                            <div key={i} className={styles.field}>
                                <label htmlFor={`priority-${i}`}>Priority {i + 1}</label>
                                <select
                                    id={`priority-${i}`}
                                    value={selectedCourses[i]}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="" disabled>
                                        Select course
                                    </option>
                                    {availableCourses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}

                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
}
