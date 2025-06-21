/**
 * ProgramItem.jsx
 *
 * This component displays a single student program with basic info like tech/humanities priorities and deadline.
 * It includes "Edit" and "Delete" functionality, using program.student_group as the identifier.
 */
import { useState } from 'react';
import styles from './CourseItem.module.css';
import { deleteProgram } from '../api/functions_for_programs.js';

/**
 * ProgramItem Component
 *
 * @component
 * @param {Object} props
 * @param {Object} props.program - The program data (student_group, tech, hum, deadline)
 * @param {Function} props.onDelete - Callback to invoke after successful deletion
 * @param {Function} props.onEdit - Callback for initiating edit
 * @returns {JSX.Element}
 */
const ProgramItem = ({ program, onDelete, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle program deletion
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete program "${program.student_group}"?`)) {
            setIsDeleting(true);
            const { error } = await deleteProgram(program.student_group);
            if (!error) {
                // Slight delay to show animation before removal
                setTimeout(() => onDelete(program.student_group), 300);
            } else {
                console.error('Delete error:', error.message);
            }
        }
    };

    // Trigger the edit flow
    const handleEdit = () => {
        if (onEdit) onEdit(program.student_group);
    };

    return (
        <div className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''}`}>
            <h2 className={styles.title}>{program.student_group}</h2>
            <p className={styles.info}>Tech priorities: {program.tech}</p>
            <p className={styles.info}>Hum priorities: {program.hum}</p>
            <p className={styles.info}>Deadline: {new Date(program.deadline).toLocaleString()}</p>

            <div className={styles.buttonsContainer}>


                {onEdit && (
                    <button onClick={handleEdit} className={styles.toggleButton}>
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button onClick={handleDelete} className={styles.deleteButton}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProgramItem;
