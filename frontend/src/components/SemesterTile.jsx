import React, { useState, useRef, useEffect } from 'react';
import styles from './SemesterTile.module.css';

/**
 * @component SemesterTile
 * @param {Object}   props.semester      - { id, semester, semester_year, is_active }
 * @param {Function} props.onSelect      - clicked anywhere on tile
 * @param {Function} props.onEdit        - clicked “Edit”
 * @param {Function} props.onDelete      - clicked “Delete”
 */
export default function SemesterTile({ semester, onSelect, onDelete, onExport }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const ref = useRef();

    // close menu on outside click
    useEffect(() => {
        const handler = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleTileClick = () => onSelect?.(semester.id);
    const toggleMenu = e => { e.stopPropagation(); setMenuOpen(m => !m); };
//     const clickEdit = e => { e.stopPropagation(); onEdit?.(semester.id); setMenuOpen(false); };
    const clickDelete = e => { e.stopPropagation(); onDelete?.(semester.id); setMenuOpen(false); };
    const clickExport = e => {e.stopPropagation();
        onExport?.(semester.id);
        setMenuOpen(false);
    };

    return (
        <div
            ref={ref}
            onClick={handleTileClick}
            className={`${styles.tile} ${semester.is_active ? styles.active : ''}`}
        >
            <span className={styles.label}>
                {semester.semester} {semester.semester_year}
            </span>

            <button
                onClick={toggleMenu}
                className={styles.menuButton}
                aria-label="Actions…"
            >
                ⋮
            </button>

            {menuOpen && (
                <div className={styles.dropdown}>
                    <button className={`${styles.dropdownItem} ${styles.exportButton}`} onClick={clickExport}>
                        Export to Excel
                    </button>
                    <button className={styles.dropdownItem} onClick={clickDelete}>
                        <span className={styles.deleteButton}>Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}