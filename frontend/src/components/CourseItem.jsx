//CourseItem.jsx

import { useState } from 'react';
import styles from './CourseItem.module.css';
import { supabase } from '../pages/supabaseClient.jsx';
import { deleteCourse } from '../api/functions_for_courses.js'

const CourseItem = ({ course, onDelete, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            setIsDeleting(true);
            const { error } = await deleteCourse(course.title);
            setTimeout(() => onDelete(course.id), 300);
        }
    };

    const handleEdit = () => {
        if (onEdit) onEdit(course.id);
    };


    return (
        <div className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''}`}>
            <h2 className={styles.title}>{course.title}</h2>
            <p className={styles.info}>Instructor: {course.teacher}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>
                Program: {Array.isArray(course.program) ? course.program.join(', ') : course.program}
            </p>

            <p className={styles.info}>
                Years: {Array.isArray(course.years) ? course.years.sort().join(', ') : 'No data'}
            </p>
            <p className={styles.info}>Type: {course.type}</p>

            {isOpen && <div className={styles.description}>{course.description}</div>}

            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={styles.toggleButton}
                >
                    {isOpen ? 'Show less' : 'Show more'}
                </button>
                {onEdit && (
                    <button
                        onClick={handleEdit}
                        className={styles.toggleButton}  // Добавь стиль в css, если нужно
                    >
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className={styles.deleteButton}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseItem;