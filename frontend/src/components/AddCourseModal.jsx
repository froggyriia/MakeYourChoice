/**
 * AddCourseModal Component
 *
 * This component provides a modal interface for adding or editing a course.
 * It allows users to input course details such as title, description, teacher,
 * language, academic programs, type, and applicable study years.
 *
 * Used in: CataloguePage.jsx.
 */

import React, {useEffect, useRef, useState} from "react"
import styles from './AddCourseModal.module.css'
import {uniquePrograms} from "../api/functions_for_courses.js"
import Select from 'react-select'

const AddCourseModal = ({
    course,
    onChange,
    onToggleYear,
    onSubmit,
    onCancel,
}) => {
    const modalRef = useRef(null)
    const textareaRef = useRef(null)
    const scrollPosition = useRef(0)
    const [programs, setPrograms] = useState([])

    /**
     * Disables page scroll and stores scroll position when modal opens.
     * Restores scroll on unmount.
     */
    useEffect(() => {
        scrollPosition.current = window.scrollY
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollPosition.current}px`
        document.body.style.width = '100%'

        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            window.scrollTo(0, scrollPosition.current)
        }
    }, [])

    /**
     * Adds event listener to close modal when Escape key is pressed.
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onCancel])

    /**
     * Loads unique academic programs from the backend on mount.
     */
    useEffect(() => {
        const loadStudentPrograms = async () => {
            try {
                const data = await uniquePrograms()
                setPrograms(data || [])
            } catch (error) {
                console.error("Error loading programs", error)
            }
        }
        loadStudentPrograms()
    }, [])

    /**
     * Auto-resize textarea on mount and when description changes
     */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [course.description])

    /**
     * Prevents wheel scrolling from propagating outside the modal.
     */
    const handleWheel = (e) => {
        e.stopPropagation()
    }

    /**
     * Handles basic text input changes.
     */
    const handleInputChange = (e) => {
        onChange({ name: e.target.name, value: e.target.value })
    }

    /**
     * Handles textarea changes with auto-resizing
     */
    const handleTextareaChange = (e) => {
        handleInputChange(e)
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    /**
     * Handles language/type button selections.
     */
    const handleButtonChange = (field, value) => {
        onChange({ name: field, value })
    }

    /**
     * Validates form and triggers submit handler.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault()

        if (!course.language) {
            alert("Please select a language.")
            return
        }
        if (!course.program || course.program.length === 0) {
            alert("Please select at least one program.")
            return
        }
        if (!course.years || course.years.length === 0) {
            alert("Please select at least one year.")
            return
        }

        onSubmit()
    }

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
                            ref={textareaRef}
                            name="description"
                            value={course.description}
                            onChange={handleTextareaChange}
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
                        <Select
                            isMulti
                            name="program"
                            options={programs.map(prog => ({ value: prog, label: prog }))}
                            value={(course.program || []).map(p => ({ value: p, label: p }))}
                            onChange={(selected) => {
                                const values = selected.map(item => item.value)
                                onChange({ name: 'program', value: values })
                            }}
                            placeholder="Select programs..."
                            className={styles.reactSelect}
                            classNamePrefix="select"
                        />
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
    )
}

export default AddCourseModal