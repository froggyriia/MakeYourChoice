import { useState } from 'react';
import styles from './CourseItem.module.css';

const CourseItem = ({ course, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            setIsDeleting(true);
            setTimeout(() => onDelete(course.id), 300);
        }
    };

    return (
        <div className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''}`}>
            <h2 className={styles.title}>{course.title}</h2>
            <p className={styles.info}>Teacher: {course.teacher}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>Program: {course.program}</p>
            <p className={styles.info}>
                Years: {Array.isArray(course.years) ? course.years.join(', ') : 'No data'}
            </p>

            {isOpen && <div className={styles.description}>{course.description}</div>}

            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={styles.toggleButton}
                >
                    {isOpen ? 'Show less' : 'Show more'}
                </button>
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