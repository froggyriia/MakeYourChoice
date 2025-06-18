import React, { useEffect, useRef, useState } from "react";
import styles from './AddCourseModal.module.css';

const AddStudentsProgramModal = ({
                                     programData,
                                     onChange,
                                     onSubmit,
                                     onCancel,
                                 }) => {
    const modalRef = useRef(null);
    const scrollPosition = useRef(0);

    // Блокировка прокрутки
    useEffect(() => {
        scrollPosition.current = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition.current);
        };
    }, []);

    // Закрытие по ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ name, value });
    };

    const handleDegreeChange = (value) => {
        onChange({ name: 'degree', value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const { degree, year, name } = programData;
        if (!degree || !year || !name) {
            alert("Please fill in all required fields.");
            return;
        }

        // Формируем код: B24-DSAI
        const programCode = `${degree[0]}${String(year).slice(-2)}-${name}`;
        onChange({ name: 'programCode', value: programCode });

        onSubmit();
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContainer}>
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <h2>Add Student Program</h2>

                    <label>
                        Degree:
                        <div className={styles.btnGroup}>
                            {['Bachelor', 'Master', 'PhD'].map((deg) => (
                                <button
                                    key={deg}
                                    type="button"
                                    className={`${styles.btn} ${programData.degree === deg ? styles.btnActive : ''}`}
                                    onClick={() => handleDegreeChange(deg)}
                                >
                                    {deg}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Admission Year:
                        <input
                            type="number"
                            name="year"
                            value={programData.year || ''}
                            onChange={handleInputChange}
                            min="2000"
                            max="2100"
                            required
                        />
                    </label>

                    <label>
                        Program Name (e.g., DSAI, CSE):
                        <input
                            type="text"
                            name="name"
                            value={programData.name || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Tech Elective Priorities:
                        <input
                            type="number"
                            name="techPriorities"
                            value={programData.techPriorities || ''}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </label>

                    <label>
                        Hum Elective Priorities:
                        <input
                            type="number"
                            name="humPriorities"
                            value={programData.humPriorities || ''}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                    </label>

                    <label>
                        Deadline:
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={programData.deadline || ''}
                            onChange={handleInputChange}
                            required
                        />
                        <small>Will be saved as timestamp (UTC)</small>
                    </label>

                    <div className={styles.buttonsContainer}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentsProgramModal;
