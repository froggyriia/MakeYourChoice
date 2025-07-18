import React, { useEffect, useRef, useState } from "react";
import styles from './AddCourseModal.module.css';
import { uniquePrograms } from "../api/functions_for_courses.js";
import Select from 'react-select';
import MDEditor from '@uiw/react-md-editor';

const AddCourseModal = ({
    course,
    onChange,
    onSubmit,
    onAccept,
    onDecline,
    onCancel,
    isStandAlone = false,
}) => {
    const modalRef = useRef(null);
    const scrollPosition = useRef(0);
    const [programs, setPrograms] = useState([]);
    const [localCourse, setLocalCourse] = useState(course);
    const isEditMode = !!onAccept && !!onDecline;

    useEffect(() => {
        setLocalCourse(course);
    }, [course]);

    useEffect(() => {
        if (!isStandAlone) {
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
        }
    }, [isStandAlone]);

    useEffect(() => {
        if (!isStandAlone) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    onCancel();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onCancel, isStandAlone]);

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

    const handleWheel = (e) => {
        e.stopPropagation();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalCourse(prev => ({ ...prev, [name]: value }));
        onChange({ name, value });
    };

    const handleButtonChange = (field, value) => {
        setLocalCourse(prev => ({ ...prev, [field]: value }));
        onChange({ name: field, value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!localCourse.language) {
            alert("Please select a language.");
            return;
        }
        if (!localCourse.program || localCourse.program.length === 0) {
            alert("Please select at least one program.");
            return;
        }
        if (!localCourse.years || localCourse.years.length === 0) {
            alert("Please select at least one year.");
            return;
        }

        if (onSubmit) {
            onSubmit();
        }
    };

    return (
    <div className={isStandAlone ? '' : styles.modalOverlay} ref={modalRef} onWheel={handleWheel}>
        <div className={isStandAlone ? styles.standaloneContainer : styles.modalContainer}>
            <div className={styles.modalContent}>
                <form onSubmit={handleFormSubmit}>
                    <h2>{isEditMode ? "Edit Course" : "Add Course"}</h2>

                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={localCourse.title || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    <label>
                        Instructor:
                        <input
                            type="text"
                            name="teacher"
                            value={localCourse.teacher || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    {/* Остальные поля оставляем без изменений */}
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
                            value={(localCourse.years || []).map(y => ({ value: y, label: y }))}
                            onChange={(selected) => {
                                const values = selected.map(item => item.value);
                                setLocalCourse(prev => ({ ...prev, years: values }));
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
                            value={(localCourse.program || []).map(p => ({ value: p, label: p }))}
                            onChange={(selected) => {
                                const values = selected.map(item => item.value);
                                setLocalCourse(prev => ({ ...prev, program: values }));
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
                                    className={`${styles.btn} ${localCourse.language === lang ? styles.btnActive : ''}`}
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
                                    className={`${styles.btn} ${localCourse.type === type ? styles.btnActive : ''}`}
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

            <div className={isStandAlone ? styles.standaloneFooter : styles.modalFooter}>
                {isEditMode ? (
                    <>
                        <button
                            type="button"
                            className={styles.declineButton}
                            onClick={onDecline}
                        >
                            Decline
                        </button>
                        <button
                            type="button"
                            className={styles.acceptButton}
                            onClick={onAccept}
                        >
                            Accept
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={handleFormSubmit}
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <>
                        <button type="submit" onClick={handleFormSubmit}>
                            Submit
                        </button>

                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

};

export default AddCourseModal;