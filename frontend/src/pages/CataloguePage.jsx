/**
 * CataloguePage.jsx
 *
 * This is the main page for course and program management.
 * It supports two types of users:
 * - Admins: can add/edit/delete courses and student programs.
 * - Students: can view courses and select electives.
 *
 * This file connects UI components with business logic and state
 * provided via contexts and custom hooks:
 *
 * Contexts & Hooks Used:
 * - AuthContext: provides current user (email, role)
 * - CatalogueContext: shared state and handlers for catalogue, programs, and exports
 * - useFormSubmit: handles student elective form submission
 *
 * Components Rendered:
 * - Header: shows email, deadline, and admin actions
 * - CourseList: shows list of courses
 * - ProgramList: admin-only, shows programs
 * - ElectivesForm: student-only, form to choose electives
 * - AddCourseModal & AddStudentsProgramModal: popups for managing data
 */

import { useState, useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import ProgramList from '../components/ProgramList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import AddStudentsProgramModal from '../components/AddStudentProgramModal.jsx';
import ElectivesForm from '../components/ElectivesForm';
import { useFormSubmit } from '../hooks/useFormSubmit';

/**
 * CataloguePage component
 *
 * The main page for both students and admins:
 * - Admins: manage courses and programs.
 * - Students: select electives.
 *
 * @returns {JSX.Element} Rendered catalogue dashboard.
 */
const CataloguePage = () => {
    // Get current user's role and email from AuthContext
    const { role, email } = useAuth();

    // Access shared state and handlers from CatalogueContext
    const { catalogue, programs, excelExport } = useCatalogueContext();

    // Get the student form submission handler using email
    const { onSubmit } = useFormSubmit(email);

    // Track selected tab in the electives form (technical/humanities)
    const { courseTypeFilter } = catalogue;

    // Store scroll position to restore after closing modals
    const scrollPosition = useRef(0);

    // Destructure course-related state and handlers
    const {
        courses,
        currentCourse,
        showAddForm,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse,
        startEditingCourse,
        startAddingCourse,
    } = catalogue;

    // Destructure program-related state and handlers
    const {
        programs: programList,
        programData,
        showModal: showProgramModal,
        setShowModal: setShowProgramModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        handleDeleteProgram,
        startEditingProgram,
    } = programs;


    // Close course modal and restore scroll position
    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    // Close program modal and restore scroll position
    const handleProgramModalCancel = () => {
        handleProgramCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            {/* Top bar: user info, admin controls */}
            <Header />

            {/* Admin: Add/Edit Course Modal */}
            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {/* Admin: Add/Edit Student Program Modal */}
            {showProgramModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleProgramChange}
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            {/* Main layout: left = courses, right = programs/form */}
            <div className={styles.pageWrapper}>
                {/* All users see the course list */}
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                        onEditCourse={role === 'admin' ? startEditingCourse : null}
                    />
                </div>

                {/* Admin-only: student programs management */}
                {role === 'admin' && (
                    <div className={styles.rightSection}>
                        <p><b>Student Programs</b></p>
                        <br />
                        <ProgramList
                            programs={programList}
                            onDeleteProgram={handleDeleteProgram}
                            onEditProgram={(groupTitle) => {
                                startEditingProgram(groupTitle); // Load selected program into modal
                                console.log('Edit program:', groupTitle);
                            }}
                        />
                    </div>
                )}

                {/* Student-only: elective course selection */}
                {role !== 'admin' && (
                    <div className={styles.rightSection}>
                        {/* Tab buttons for selecting electives type */}

                        {/* Elective form submission logic handled via useFormSubmit */}
                        <ElectivesForm
                            type={courseTypeFilter}
                            onSubmit={(selectedCourses) => onSubmit(selectedCourses, courseTypeFilter)}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CataloguePage;
