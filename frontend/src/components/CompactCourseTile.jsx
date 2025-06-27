// CompactCourseTile.jsx
import styles from './CompactCourseTile.module.css';

/**
 * Renders a compact course tile showing minimal info: title, program, and language.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.course - The course object to display.
 * @param {Function} props.onClick - Callback when the tile is clicked (optional).
 * @returns {JSX.Element}
 */
const CompactCourseTile = ({ course, onClick }) => {
    return (
        <div
            className={`${styles.tile} ${course.archived ? styles.archived : ''}`}
            onClick={() => onClick?.(course.id)}
        >
            <h3 className={styles.title}>{course.title}</h3>
            <p className={styles.info}>Program: {Array.isArray(course.program) ? course.program.join(', ') : course.program}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>Type: {course.type}</p>
        </div>
    );
};

export default CompactCourseTile;
