import React from 'react';
import { useCatalogueContext } from '../context/CatalogueContext';
import styles from './CourseListGrid.module.css';

/**
 * @component
 * @name CourseListGrid
 * @description
 * Renders a compact table of courses showing all fields except description.
 * Clicking on a row invokes `onRowClick(courseId)` if provided.
 * Now includes neon green highlight for search matches.
 *
 * @param {Object[]} props.courses        - Array of course objects.
 * @param {Function} [props.onRowClick]   - Optional callback when a row is clicked.
 * @returns {JSX.Element}
 */
const CourseListGrid = ({ courses, onRowClick }) => {
    const { catalogue } = useCatalogueContext();
    const { searchQuery } = catalogue;

    const highlightText = (text, query) => {
        if (!query || query.length < 3 || !text) return text;
        
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, i) => 
            regex.test(part) ? (
                <span key={i} className={styles.highlightMatch}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

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
                            <td>{highlightText(course.title, searchQuery)}</td>
                            <td>{highlightText(course.teacher, searchQuery)}</td>
                            <td>{course.language}</td>
                            <td>{highlightText(course.program.join(', '), searchQuery)}</td>
                            <td>{course.years.join(', ')}</td>
                            <td>{course.type === 'tech' ? 'Technical' : 'Humanities'}</td>
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