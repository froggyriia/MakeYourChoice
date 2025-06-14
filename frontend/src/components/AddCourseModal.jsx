import React from 'react';
import styles from './AddCourseModal.module.css';


const AddCourseModal = ({ newCourse, onChange, onYearsChange, onSubmit, onCancel }) => {

    const handleSingleSelect = (field, value) => {
        onChange({ target: { name: field, value } });
    };

    const toggleYear = (year) => {
        onYearsChange({ target: { value: year } });
    };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <form onSubmit={onSubmit} className={styles.form}>
                    <h2>Add Course</h2>

                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={newCourse.title}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={newCourse.description}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label>
                        Teacher:
                        <input
                            type="text"
                            name="teacher"
                            value={newCourse.teacher}
                            onChange={onChange}
                            required
                        />
                    </label>

                    <label>
                        Language:
                        <div className={styles.btnGroup}>
                            {['Rus', 'Eng'].map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`${styles.btn} ${newCourse.language === lang ? styles.btnActive : ''}`}
                                    onClick={() => handleSingleSelect('language', lang)}
                                >
                                    {lang === 'Rus' ? 'Русский' : 'Английский'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Program:
                        <div className={styles.btnGroup}>
                            {['Rus Program', 'Eng Program'].map(program => (
                                <button
                                    key={program}
                                    type="button"
                                    className={`${styles.btn} ${newCourse.program === program ? styles.btnActive : ''}`}
                                    onClick={() => handleSingleSelect('program', program)}
                                >
                                    {program === 'Rus Program' ? 'Русская программа' : 'Английская программа'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Course type:
                        <div className={styles.btnGroup}>
                            {['tech', 'hum'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`${styles.btn} ${newCourse.type === type ? styles.btnActive : ''}`}
                                    onClick={() => handleSingleSelect('type', type)}
                                >
                                    {type === 'tech' ? 'Technical' : 'Humanities'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Years:
                        <div className={styles.btnGroup}>
                            {[1, 2, 3, 4].map(year => {
                                const years = newCourse.years || [];
                                const active = years.includes(year);
                                return (
                                    <button
                                        key={year}
                                        type="button"
                                        className={`${styles.btn} ${active ? styles.btnActive : ''}`}
                                        onClick={() => toggleYear(year)}
                                    >
                                        {year}
                                    </button>
                                );
                            })}
                        </div>
                    </label>

                    <div className={styles.buttonsContainer}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default AddCourseModal;
