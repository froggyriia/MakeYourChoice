// components/ProgramItem.jsx

import { useState } from 'react';
import styles from './CourseItem.module.css';
import { deleteProgram } from '../api/functions_for_programs.js';

const ProgramItem = ({ program, onDelete, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete program "${program.student_group}"?`)) {
            setIsDeleting(true);
            const { error } = await deleteProgram(program.student_group);
            if (!error) {
                setTimeout(() => onDelete(program.student_group), 300);
            } else {
                console.error('Delete error:', error.message);
            }
        }
    };

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
