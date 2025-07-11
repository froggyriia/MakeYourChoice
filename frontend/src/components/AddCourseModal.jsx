import React, { useEffect, useRef, useState } from "react";
import styles from './AddCourseModal.module.css';
import { uniquePrograms } from "../api/functions_for_courses.js";
import Select from 'react-select';
import MDEditor from '@uiw/react-md-editor';

const AddCourseModal = ({
    course,
    onChange,
    onToggleYear,
    onSubmit,
    onCancel,
}) => {
    const modalRef = useRef(null);
    const textareaRef = useRef(null);
    const scrollPosition = useRef(0);
    const [programs, setPrograms] = useState([]);

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    useEffect(() => {
        const loadStudentPrograms = async () => {
            try {
                const data = await uniquePrograms();
                setPrograms(data || []);
            } catch (error) {
                console.error("Error loading programs", error);
            }
        };
        loadStudentPrograms();
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [course.description]);

    const handleWheel = (e) => {
        e.stopPropagation();
    };

    const handleInputChange = (e) => {
        onChange({ name: e.target.name, value: e.target.value });
    };

    const handleTextareaChange = (e) => {
        handleInputChange(e);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
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
        <div className={styles.modalOverlay} ref={modalRef} onWheel={handleWheel}>
            <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                    <form onSubmit={handleFormSubmit}>
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
                            Instructor:
                            <input
                                type="text"
                                name="teacher"
                                value={course.teacher}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        <label>
                            Years:
                            <Select
                                isMulti
                                name="years"
                                options={[
                                    'BS1', 'BS2', 'BS3', 'BS4',
                                    'M1', 'M2',
                                    'PhD1', 'PhD2', 'PhD3', 'PhD4',
                                ].map(y => ({ value: y, label: y }))}
                                value={(course.years || []).map(y => ({ value: y, label: y }))}
                                onChange={(selected) => {
                                    const values = selected.map(item => item.value);
                                    onChange({ name: 'years', value: values });
                                }}
                                placeholder="Select years..."
                                className={styles.reactSelect}
                                classNamePrefix="select"
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    menu: base => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
                                }}
                            />
                        </label>

                        <label>
                            Program:
                            <Select
                                isMulti
                                name="program"
                                options={programs.map(prog => ({ value: prog, label: prog }))}
                                value={(course.program || []).map(p => ({ value: p, label: p }))}
                                onChange={(selected) => {
                                    const values = selected.map(item => item.value);
                                    onChange({ name: 'program', value: values });
                                }}
                                placeholder="Select programs..."
                                className={styles.reactSelect}
                                classNamePrefix="select"
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
                            Description:
                            <div data-color-mode="light">
                                <MDEditor
                                    value={course.description}
                                    onChange={(value) => onChange({ name: 'description', value: value || '' })}
                                    height={400}
                                />
                            </div>
                        </label>

                    </form>
                </div>

                <div className={styles.modalFooter}>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" onClick={handleFormSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCourseModal;