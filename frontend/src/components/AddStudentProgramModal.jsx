import React, { useEffect, useRef } from 'react';
import styles from './AddCourseModal.module.css';
import Select from 'react-select';

const AddStudentsProgramModal = ({
                                     programData,
                                     onChange,
                                     onSubmit,
                                     onCancel,
                                 }) => {
    const modalRef = useRef(null);
    const scrollPosition = useRef(0);

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleInputChange = (e) => {
        onChange({ name: e.target.name, value: e.target.value });
    };

    const handleButtonChange = (name, value) => {
        onChange({ name, value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!programData.stage || !programData.year || !programData.shortName) {
            alert('Please fill all required fields');
            return;
        }
        onSubmit();
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContainer}>
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <h2>Add Student Program</h2>

                    <label>
                        Stage:
                        <div className={styles.btnGroup}>
                            {['B', 'M', 'P'].map((s) => (
                                <button
                                    type="button"
                                    key={s}
                                    className={`${styles.btn} ${programData.stage === s ? styles.btnActive : ''}`}
                                    onClick={() => handleButtonChange('stage', s)}
                                >
                                    {s === 'B' ? 'Bachelor' : s === 'M' ? 'Master' : 'PhD'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Year of Entry:
                        <input
                            type="number"
                            name="year"
                            min="2000"
                            max="2100"
                            value={programData.year}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Program Short Name (e.g. DSAI):
                        <input
                            type="text"
                            name="shortName"
                            value={programData.shortName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Tech Elective Priority Count:
                        <input
                            type="number"
                            name="techCount"
                            min="0"
                            value={programData.techCount}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Humanities Elective Priority Count:
                        <input
                            type="number"
                            name="humCount"
                            min="0"
                            value={programData.humCount}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Deadline:
                        <input
                            type="datetime-local"
                            name="deadline"
                            value={programData.deadline}
                            onChange={handleInputChange}
                            required
                        />
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
