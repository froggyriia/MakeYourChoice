    import { useState } from 'react';
import styles from './CourseItem.module.css';

const SuggestedCourseItem = ({ course, onAccept, onEdit, onDecline }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.courseItem}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>{course.title}</h2>
            </div>

            <p className={styles.info}>Instructor: {course.teacher}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>
                Program: {Array.isArray(course.program) ? course.program.join(', ') : course.program}
            </p>
            <p className={styles.info}>
                Years: {Array.isArray(course.years) ? course.years.join(', ') : course.years}
            </p>
            <p className={styles.info}>Type: {course.type}</p>

            {isOpen && (
                <div className={styles.description}>
                    {course.description}
                </div>
            )}

            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={styles.toggleButton}
                >
                    {isOpen ? 'Show less' : 'Show more'}
                </button>

                <button
                    onClick={() => onAccept(course)}
                    className={styles.toggleButton}
                    style={{ backgroundColor: '#4caf50' }}
                >
                    Accept
                </button>

                <button
                    onClick={() => onEdit(course)}
                    className={styles.toggleButton}
                    style={{ backgroundColor: '#2196f3' }}
                >
                    Edit
                </button>

                <button
                    onClick={() => onDecline(course.id)}
                    className={styles.deleteButton}
                >
                    Decline
                </button>
            </div>
        </div>
    );
};

export default SuggestedCourseItem;