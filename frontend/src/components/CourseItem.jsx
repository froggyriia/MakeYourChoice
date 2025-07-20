/**
 * CourseItem.jsx
 *
 * This component displays a single course's information in a card-style UI block.
 * It allows toggling detailed view, editing, and deleting the course.
 * Used in: CataloguePage.jsx
 */
import { useState, useRef, useEffect } from 'react';
import { useCatalogueContext } from '../context/CatalogueContext';
import styles from './CourseItem.module.css';
import { deleteCourse } from '../api/functions_for_courses';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import { showConfirm, showNotify } from './CustomToast';

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
    const { catalogue } = useCatalogueContext();
    const { searchQuery } = catalogue;
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
        showConfirm(`Are you sure you want to delete "${course.title}"?`, async () => {
            setIsDeleting(true);
            await deleteCourse(course.title);
            onDelete(course.id);

        });

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

    const renderMarkdownWithHighlights = (text, query) => {
        const highlighted = highlightText(text, query);
        if (Array.isArray(highlighted)) {
            return highlighted.map((frag, i) => 
                typeof frag === 'string' ? frag : frag.props.children
            ).join('');
        }
        return highlighted;
    };

    return (
        <div className={`${styles.courseItem} ${isDeleting ? styles.deleting : ''} ${
            course.archived ? styles.archived : ''
        }`}>
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    {highlightText(course.title, searchQuery)}
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
                                    {course.archived ? 'Unarchive' : 'Archive'}
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.courseInfo}>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Instructor: </span>
                    {highlightText(course.teacher, searchQuery)}
                </p>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Language: </span>
                    {course.language}
                </p>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Program: </span>
                    {Array.isArray(course.program) 
                        ? highlightText(course.program.join(', '), searchQuery)
                        : course.program}
                </p>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Years: </span>
                    {Array.isArray(course.years) 
                        ? course.years.sort().join(', ') 
                        : 'No data'}
                </p>
                <p className={styles.info}>
                    <span className={styles.infoLabel}>Type: </span>
                    {course.type}
                </p>
            </div>

            {isOpen && (
                <div className={styles.description}>
                    <MarkdownPreview
                        source={renderMarkdownWithHighlights(course.description, searchQuery)}
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