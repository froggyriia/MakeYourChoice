import React from 'react';
import SemesterTile from './SemesterTile';
import styles from './SemesterList.module.css';

/**
 * @component SemesterList
 * @param {Object[]} props.semesters  - Array of semester records
 * @param {Function} props.onSelect   - Called when a tile is clicked
 * @param {Function} props.onEdit     - Called when a tile’s “Edit” is clicked
 * @param {Function} props.onDelete   - Called when “Delete” is clicked
 */
export default function SemesterList({ semesters, onSelect, onEdit, onDelete }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>All Semesters</div>
            <div className={styles.list}>
                {semesters.map(s => (
                    <SemesterTile
                        key={s.id}
                        semester={s}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
