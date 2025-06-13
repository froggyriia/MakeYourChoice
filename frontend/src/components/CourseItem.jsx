import { useState } from 'react';
import styles from './CourseItem.module.css';

const CourseItem = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.courseItem}>
            <h2 className={styles.title}>{course.title}</h2>
            <p className={styles.info}>Teacher: {course.teacher}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>Program: {course.program}</p>
            <p className={styles.info}>
                Years: {Array.isArray(course.years) ? course.years.join(', ') : 'No data'}
            </p>

            {isOpen && <div className={styles.description}>{course.description}</div>}

            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={styles.toggleButton}
            >
                {isOpen ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export default CourseItem;
