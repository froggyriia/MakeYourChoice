/**
 * CourseItem.jsx
 *
 * This component displays a single course's information in a card-style UI block.
 * It allows toggling detailed view, editing, and deleting the course.
 * Used in: CataloguePage.jsx
 */
import { useState, useRef, useEffect } from 'react';
import styles from './CourseItem.module.css';
import { deleteCourse } from '../api/functions_for_courses.js'
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';

/**
 * Renders a course item with title, instructor, language, programs, years, and type.
 * Includes edit, delete, and show/hide description functionality.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.course - The course object to display.
 * @param {Function} props.onDelete - Callback to invoke after a course is deleted.
 * @param {Function} props.onEdit - Callback to invoke when editing is triggered.
 * @returns {JSX.Element}
 */
const CourseItem = ({ course, onDelete, onEdit, onArchive}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Handles the deletion of a course.
     * Prompts user for confirmation, deletes the course via API,
     * and then triggers the `onDelete` callback.
     */
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            setIsDeleting(true);
            const { error } = await deleteCourse(course.title);
            setTimeout(() => onDelete(course.id), 300);
        }
    };

    /**
     * Handles the edit button click by invoking the parent `onEdit` callback.
     */
    const handleEdit = () => {
        if (onEdit) onEdit(course.id);
        setMenuOpen(false);
    };

    const handleArchive = async () => {
        if (onArchive) {
            setIsArchiving(true);
            await onArchive(course.id, course.archived);
            setIsArchiving(false);
            setMenuOpen(false);
        }
    };



    return (
        <div
            className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''} ${
                course.archived ? styles.archived : ''
            }`}
        >
            <div className={styles.titleRow}>
                <h2 className={styles.title}>{course.title}</h2>
                <div className={styles.menuWrapper} ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className={styles.menuButton}
                    >
                        ⋮
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdown}>
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleArchive}>
                                {course.archived ? 'De-archive' : 'Archive'}
                            </button>
                            <button onClick={handleDelete} className={styles.deleteButton}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className={styles.info}>Instructor: {course.teacher}</p>
            <p className={styles.info}>Language: {course.language}</p>
            <p className={styles.info}>
                Program:{' '}
                {Array.isArray(course.program)
                    ? course.program.join(', ')
                    : course.program}
            </p>
            <p className={styles.info}>
                Years:{' '}
                {Array.isArray(course.years) ? course.years.sort().join(', ') : 'No data'}
            </p>
            <p className={styles.info}>Type: {course.type}</p>

            {isOpen && (
                <div className={styles.description}>
                    <MarkdownPreview source={course.description} />
                </div>
            )}

            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={styles.toggleButton}
                >
                    {isOpen ? 'Show less' : 'Show more'}
                </button>
            </div>
        </div>
    );
};

export default CourseItem;