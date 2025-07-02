import React from 'react';
import styles from './CourseListGrid.module.css';

/**
 * @component
 * @name CourseListGrid
 * @description
 * Renders a compact table of courses showing all fields except description.
 * Clicking on a row invokes `onRowClick(courseId)` if provided.
 *
 * @param {Object[]} props.courses        - Array of course objects.
 * @param {Function} [props.onRowClick]   - Optional callback when a row is clicked.
 * @returns {JSX.Element}
 */
const CourseListGrid = ({ courses, onRowClick }) => {
    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Language</th>
                <th>Programs</th>
                <th>Years</th>
                <th>Type</th>
            </tr>
            </thead>
            <tbody>
            {courses.length > 0 ? (
                courses.map(course => (
                    <tr
                        key={course.id}
                        className={onRowClick ? styles.clickable : ''}
                        onClick={() => onRowClick && onRowClick(course.id)}
                    >
                        <td>{course.title}</td>
                        <td>{course.teacher}</td>
                        <td>{course.language}</td>
                        <td>{course.program.join(', ')}</td>
                        <td>{course.years.join(', ')}</td>
                        <td>
                            {course.type === 'tech' ? 'Technical' : 'Humanities'}
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6" className={styles.empty}>
                        No available courses
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default CourseListGrid;
