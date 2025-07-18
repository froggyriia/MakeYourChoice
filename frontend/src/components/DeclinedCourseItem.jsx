import { useState } from 'react';
import styles from './CourseItem.module.css';

const DeclinedCourseItem = ({ course, onRecover, onDelete }) => {
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
                    onClick={() => onRecover(course)}
                    className={styles.toggleButton}
                    style={{ backgroundColor: '#4caf50' }}
                >
                    Recover
                </button>

                <button
                    onClick={() => onDelete(course.id)}
                    className={styles.deleteButton}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeclinedCourseItem;