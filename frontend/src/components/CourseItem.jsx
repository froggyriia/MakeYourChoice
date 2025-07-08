/**
 * CourseItem.jsx
 *
 * This component displays a single course's information in a card-style UI block.
 * It allows toggling detailed view, editing, and deleting the course.
 * Used in: CataloguePage.jsx
 */
import { useState, useRef, useEffect } from 'react';
import styles from './CourseItem.module.css';
import { deleteCourse } from '../api/functions_for_courses.js';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';

/**
 * Renders a course item with title, instructor, language, programs, years, and type.
 * Includes edit, delete, and show/hide description functionality.
 * Menu is displayed only if role === 'admin'
 */
const CourseItem = ({ course, onDelete, onEdit, onArchive, role }) => {
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

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
            setIsDeleting(true);
            await deleteCourse(course.title);
            setTimeout(() => onDelete(course.id), 300);
        }
    };

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

    function highlightMatch(text, match) {
        if (!match || !match.indices) return text;

        const fragments = [];
        let lastIndex = 0;

        match.indices.forEach(([start, end], idx) => {
        // обычный текст перед совпадением
        if (start > lastIndex) {
            fragments.push(text.slice(lastIndex, start));
        }
        // подсвеченный фрагмент
        fragments.push(
            <mark key={idx} style={{ backgroundColor: '#fcf89f' }}>
                {text.slice(start, end + 1)}
            </mark>
        );
        lastIndex = end + 1;
        });

        // остаток строки после последнего совпадения
        if (lastIndex < text.length) {
            fragments.push(text.slice(lastIndex));
        }

        return fragments;
    }

    return (
    <div
        className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''} ${
            course.archived ? styles.archived : ''
        }`}
    >
        <div className={styles.titleRow}>
            <h2 className={styles.title}>
                {highlightMatch(
                    course.title,
                    course._matches?.find((m) => m.key === 'title')
                )}
            </h2>

            {role === 'admin' && (
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
            )}
        </div>

        <p className={styles.info}>
            Instructor:{' '}
            {highlightMatch(
                course.teacher,
                course._matches?.find((m) => m.key === 'teacher')
            )}
        </p>
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
                <MarkdownPreview
                    source={
                        // Подсвечиваем description, если есть совпадения
                        course._matches?.find((m) => m.key === 'description')
                            ? highlightMatch(
                                  course.description,
                                  course._matches.find((m) => m.key === 'description')
                              )
                                  .map((frag) =>
                                      typeof frag === 'string' ? frag : frag.props.children
                                  )
                                  .join('')
                            : course.description
                    }
                />
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