// CourseListGrid.jsx
import CompactCourseTile from './CompactCourseTile';
import styles from './CourseListGrid.module.css';

/**
 * Renders a grid of compact course tiles.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.courses - List of course objects.
 * @param {Function} [props.onTileClick] - Callback when a course tile is clicked (optional).
 * @returns {JSX.Element}
 */
const CourseListGrid = ({ courses, onTileClick }) => {
    return (
        <div className={styles.grid}>
            {courses.length ? (
                courses.map((course) => (
                    <CompactCourseTile key={course.id} course={course} onClick={onTileClick} />
                ))
            ) : (
                <p>No available courses</p>
            )}
        </div>
    );
};

export default CourseListGrid;
