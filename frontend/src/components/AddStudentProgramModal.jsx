/**
 * AddStudentsProgramModal Component
 *
 * This modal allows administrators to create or edit a student academic program.
 * It collects data such as stage (Bachelor/Master/PhD), year of entry, short program name,
 * elective priority counts, and deadline.
 *
 * Used in: CoursePage.jsx.
 */

import React, { useEffect, useRef } from 'react';
import styles from './AddCourseModal.module.css';
import Select from 'react-select';
import PropTypes from 'prop-types';
/**
 * Modal component to add or edit a student program.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.programData - The state object for the program form.
 * @param {Function} props.onChange - Handler to update form values.
 * @param {Function} props.onSubmit - Callback triggered when submitting the form.
 * @param {Function} props.onCancel - Callback triggered when cancelling the modal.
 * @returns {JSX.Element} Modal form for managing student programs.
 */
const AddStudentsProgramModal = ({
                                     programData,
                                     onChange,
                                     onSubmit,
                                     onCancel,
                                 }) => {
    const modalRef = useRef(null);
    const scrollPosition = useRef(0);

    /**
     * Disables background scroll and stores scroll position on mount.
     * Restores scroll on unmount.
     */
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

    /**
     * Closes modal when Escape key is pressed.
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    /**
     * Handles changes to text and number input fields.
     *
     * @param {Event} e - Input change event.
     */
    const handleInputChange = (e) => {
        onChange({ name: e.target.name, value: e.target.value });
    };

    /**
     * Handles updates to button-style inputs (stage: Bachelor, Master, PhD).
     *
     * @param {string} name - Field name to update.
     * @param {string|number} value - New value to set.
     */
    const handleButtonChange = (name, value) => {
        onChange({ name, value });
    };

    /**
     * Validates required fields and triggers form submission.
     *
     * @param {Event} e - Form submission event.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Validate that key fields are filled
        if ( !programData.shortName) {
            alert('Please fill all required fields');
            return;
        }
        console.log("[AddStudentsProgramModal] submitting new program:", programData);

        onSubmit(); // Trigger form submission after validation
    };

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContainer}>
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <h2>Add Student Program</h2>

                    <label>
                        Year:
                        <select
                            value={programData.year}
                            onChange={(e) => onChange({ name: 'year', value: e.target.value })}
                        >
                            <option value="">Select year</option>
                            {['BS1','BS2','BS3','BS4','M1','M2','PhD1','PhD2','PhD3','PhD4'].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
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


                    <div className={styles.buttonsContainer}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddStudentsProgramModal.propTypes = {
    programData: PropTypes.shape({
        shortName: PropTypes.string.isRequired,
        techCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        humCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        id: PropTypes.number, // optional
    }),
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};


export default AddStudentsProgramModal;
