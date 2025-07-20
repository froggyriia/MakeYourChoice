import React, { useEffect, useRef } from 'react';
import styles from './AddCourseModal.module.css';
import Select from 'react-select';
import PropTypes from 'prop-types';
import {showNotify} from "@/components/CustomToast.jsx";

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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!programData.shortName) {
            showNotify("Please fill all required fields");

            return;
        }
        console.log("[AddStudentsProgramModal] submitting new program:", programData);
        onSubmit();
        showNotify("Student program was updated successfully");
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContainer}>
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <h2>Add Student Program</h2>

                    {/* Year — первая "полка" */}
                    <div className={styles.formField}>
                        <label>Year:</label>
                        <select
                            name="year"
                            value={programData.year}
                            onChange={handleInputChange}
                        >
                            <option value="">Select year</option>
                            {['BS1', 'BS2', 'BS3', 'BS4', 'M1', 'M2', 'PhD1', 'PhD2', 'PhD3', 'PhD4'].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Program Short Name — вторая "полка" */}
                    <div className={styles.formField}>
                        <label>Program Short Name (e.g. DSAI):</label>
                        <input
                            type="text"
                            name="shortName"
                            value={programData.shortName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Tech Count — третья "полка" */}
                    <div className={styles.formField}>
                        <label>Tech Elective Priority Count:</label>
                        <input
                            type="number"
                            name="techCount"
                            min="0"
                            value={programData.techCount}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Humanities Count — четвёртая "полка" */}
                    <div className={styles.formField}>
                        <label>Humanities Elective Priority Count:</label>
                        <input
                            type="number"
                            name="humCount"
                            min="0"
                            value={programData.humCount}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.buttonsContainer}>
                        <button type="submit" className={styles.submitButton}>Submit</button>
                        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddStudentsProgramModal.propTypes = {
    programData: PropTypes.shape({
        year: PropTypes.string,
        shortName: PropTypes.string.isRequired,
        techCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        humCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        id: PropTypes.number,
    }),
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AddStudentsProgramModal;
