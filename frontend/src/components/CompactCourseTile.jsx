// CompactCourseTile.jsx
import styles from './CompactCourseTile.module.css';

/**
 * Renders a compact course tile showing minimal info: title, program, and language.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.course - The course object to display.
 * @param {Function} props.onClick - Callback when the tile is clicked (optional).
 * @param {string} props.searchQuery - Текущий поисковый запрос (для подсветки).
 * @returns {JSX.Element}
 */
const CompactCourseTile = ({ course, onClick, searchQuery }) => {
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
        <div
            className={`${styles.tile} ${course.archived ? styles.archived : ''}`}
            onClick={() => onClick?.(course.id)}
        >
            <h3 className={styles.title}>
                {highlightText(course.title, searchQuery)}
            </h3>
            <p className={styles.info}>
                Program: {Array.isArray(course.program) 
                    ? highlightText(course.program.join(', '), searchQuery) 
                    : highlightText(course.program, searchQuery)}
            </p>
            <p className={styles.info}>
                Language: {highlightText(course.language, searchQuery)}
            </p>
            <p className={styles.info}>
                Type: {highlightText(course.type, searchQuery)}
            </p>
        </div>
    );
};

export default CompactCourseTile;