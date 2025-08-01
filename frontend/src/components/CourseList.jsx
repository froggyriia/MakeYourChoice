/**
 * CourseList.jsx
 *
 * This component renders a list of CourseItem components.
 * It takes in a list of courses and delegates edit/delete actions
 * to the corresponding callback handlers.
 */
import CourseItem from './CourseItem';
import { useAuth } from '../context/AuthContext';

/**
 * Renders a list of courses using the CourseItem component.
 * If no courses are provided, displays a fallback message.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.courses - Array of course objects to display.
 * @param {Function} props.onDeleteCourse - Callback when a course is deleted.
 * @param {Function} props.onEditCourse - Callback when a course is edited.
 * @returns {JSX.Element}
 */
const CourseList = ({ courses, onDeleteCourse, onEditCourse, onArchiveCourse }) => {
    const { currentRole } = useAuth();
    return (
        <div>
            {courses.length ? (
                courses.map((course) => (
                    <CourseItem
                        key={course.id}
                        course={course}
                        onDelete={onDeleteCourse}
                        onEdit={onEditCourse}
                        onArchive={onArchiveCourse}
                        role={currentRole}
                    />
                ))
            ) : (
                <p>No available courses</p>
            )}
        </div>
    );
};

export default CourseList;