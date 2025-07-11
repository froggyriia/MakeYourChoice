import React, { useState, useRef, useEffect } from 'react';
import styles from './SemesterTile.module.css';

/**
 * @component SemesterTile
 */
export default function SemesterTile({ semester, onSelect, onEdit, onDelete }) {
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

    const handleTileClick = () => {
        onSelect?.(semester.id);
    };

    const toggleMenu = e => {
        e.stopPropagation();
        setMenuOpen(v => !v);
    };

    const clickEdit = e => {
        e.stopPropagation();
        onEdit?.(semester.id);
        setMenuOpen(false);
    };

    const clickDelete = e => {
        e.stopPropagation();
        onDelete?.(semester.id);
        setMenuOpen(false);
    };

    return (
        <div
            className={`${styles.tile} ${semester.is_active ? styles.active : ''}`}
            onClick={handleTileClick}
            ref={ref}
        >
      <span className={styles.label}>
        {semester.semester} {semester.semester_year}
      </span>
            <button className={styles.menuButton} onClick={toggleMenu}>
                ⋮
            </button>
            {menuOpen && (
                <div className={styles.menu}>
                    <button onClick={clickEdit}>Edit</button>
                    <button onClick={clickDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}
