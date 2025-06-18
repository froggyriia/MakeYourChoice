import React, { useEffect, useRef } from "react";
import styles from './AddCourseModal.module.css';

const AddCourseModal = ({
    course,
    onChange,
    onToggleYear,
    onSubmit,
    onCancel,
}) => {
    const modalRef = useRef(null);
    const scrollPosition = useRef(0);

    // Блокировка прокрутки при открытии
    useEffect(() => {
        scrollPosition.current = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition.current);
        };
    }, []);

    // Закрытие по ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    // Блокировка прокрутки колесиком мыши
    const handleWheel = (e) => {
        e.stopPropagation();
    };

    const handleInputChange = (e) => {
        onChange({ name: e.target.name, value: e.target.value });
    };

    const handleButtonChange = (field, value) => {
        onChange({ name: field, value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!course.language) {
            alert("Please select a language.");
            return;
        }
        if (!course.program || course.program.length === 0) {
            alert("Please select at least one program.");
            return;
        }
        if (!course.years || course.years.length === 0) {
            alert("Please select at least one year.");
            return;
        }
        onSubmit();
    };

    return (
        <div 
            className={styles.modalOverlay}
            ref={modalRef}
            onWheel={handleWheel}
        >
            <div className={styles.modalContainer}>
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <h2>Add Course</h2>

                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={course.title}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={course.description}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Teacher:
                        <input
                            type="text"
                            name="teacher"
                            value={course.teacher}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Language:
                        <div className={styles.btnGroup}>
                            {['Rus', 'Eng'].map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    className={`${styles.btn} ${course.language === lang ? styles.btnActive : ''}`}
                                    onClick={() => handleButtonChange('language', lang)}
                                >
                                    {lang === 'Rus' ? 'Russian' : 'English'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Program:
                        <div className={styles.btnGroup}>
                            {['Rus Program', 'Eng Program'].map((prog) => (
                                <button
                                    key={prog}
                                    type="button"
                                    className={`${styles.btn} ${course.program.includes(prog) ? styles.btnActive : ''}`}
                                    onClick={() =>
                                        onChange({
                                            name: 'program',
                                            value: course.program.includes(prog)
                                                ? course.program.filter(p => p !== prog)
                                                : [...course.program, prog]
                                        })
                                    }
                                >
                                    {prog}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Course type:
                        <div className={styles.btnGroup}>
                            {['tech', 'hum'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`${styles.btn} ${course.type === type ? styles.btnActive : ''}`}
                                    onClick={() => handleButtonChange('type', type)}
                                >
                                    {type === 'tech' ? 'Technical' : 'Humanities'}
                                </button>
                            ))}
                        </div>
                    </label>

                    <label>
                        Years:
                        <div className={styles.btnGroup}>
                            {[1, 2, 3, 4].map((year) => (
                                <button
                                    key={year}
                                    type="button"
                                    className={`${styles.btn} ${course.years.includes(year) ? styles.btnActive : ''}`}
                                    onClick={() => onToggleYear(year)}
                                >
                                    {year}
                                </button>
                            ))}
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