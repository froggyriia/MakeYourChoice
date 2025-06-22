/**
 * CataloguePage.jsx
 *
 * This is the main page for managing and interacting with the course catalogue.
 * It supports two user roles:
 * - **Admin**: Can add/edit/delete courses and student programs, export data to Excel.
 * - **Student**: Can select and submit their elective course preferences.
 *
 * Data and functionality flow:
 * - Uses `useCatalogue` for managing courses (fetching, editing, submitting, deleting).
 * - Uses `usePrograms` to manage student program groups (fetching, adding, deleting).
 * - Uses `useExcelExport` for exporting all priority data to Excel file.
 * - Uses `useFormSubmit` to manage students' course selections and form submission.
 * - Components like `AddCourseModal`, `AddStudentProgramModal`, `ElectivesForm` handle UI interactions.
 * - `AuthContext` determines the user role and email for access control.
 */

import { useState, useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import ProgramList from '../components/ProgramList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogue } from '../hooks/useCatalogue';
import { usePrograms } from "../hooks/usePrograms.js";
import AddStudentsProgramModal from "../components/AddStudentProgramModal.jsx";
import ElectivesForm from '../components/ElectivesForm';
import { useExcelExport } from '../hooks/useExcelExport';
import { useFormSubmit } from '../hooks/useFormSubmit';

const CataloguePage = () => {
    // Get current user's role and email from Auth context
    const { role, email } = useAuth();

    // Used to scroll back to same position after closing modal
    const scrollPosition = useRef(0);

    // Local state to track selected tab (technical or humanities)
    const [activeTab, setActiveTab] = useState('tech');

    // === COURSE HOOK ===
    // useCatalogue handles logic for loading, adding, editing, and deleting courses
    const {
        courses,                  // array of all courses
        loading,                  // loading state for courses
        error,                    // error while fetching courses
        currentCourse,            // currently selected course to edit
        showAddForm,              // whether the add/edit course modal is open
        setShowAddForm,           // toggle modal open/close
        handleChange,             // handle field input in course form
        handleYearsChange,        // toggle course availability by year
        handleSubmit,             // submit course form (add/edit)
        handleCancel,             // cancel course form
        handleDeleteCourse,       // delete selected course
        startEditingCourse,       // begin editing course (opens modal with data)
        startAddingCourse         // prepare form to add new course
    } = useCatalogue();

    // === EXCEL EXPORT HOOK ===
    // useExcelExport handles exporting priorities table to .xlsx
    const { isExported, exportToExcel } = useExcelExport();

    // === FORM SUBMIT HOOK ===
    // useFormSubmit handles elective form submission for students
    const { onSubmit } = useFormSubmit(email);

    // === PROGRAMS HOOK ===
    // usePrograms manages adding/editing/deleting student programs
    const {
        programs,                      // list of all student programs
        programData,                   // current program being edited/added
        showModal: showProgramModal,   // whether program modal is shown
        setShowModal: setShowProgramModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        handleDeleteProgram,           // removes program from Supabase and UI
        startEditingProgram,           // prepares program data for editing
        error: programError
    } = usePrograms();

    /**
     * Stores the scroll position and opens course modal in add mode.
     */
    const handleAddCourseClick = () => {
        scrollPosition.current = window.scrollY;
        startAddingCourse();
    };

    /**
     * Closes course modal and scrolls back to original position.
     */
    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    /**
     * Closes program modal and scrolls back to original position.
     */
    const handleProgramModalCancel = () => {
        handleProgramCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            <Header />

            {/* === PAGE HEADER === */}
            <div className={styles.headerContainer}>
                <div className={styles.titleContainer}>Course Catalogue</div>

                {/* Admin-only buttons for adding courses, programs, and exporting data */}
                {role === 'admin' && (
                    <div className={styles.adminActions}>
                        <button className={styles.addCourseButton} onClick={handleAddCourseClick}>
                            Add course
                        </button>
                        <button className={styles.addCourseButton} onClick={() => setShowProgramModal(true)}>
                            Add Student Program
                        </button>
                        <button onClick={exportToExcel} className={styles.exportButton}>
                            {isExported ? 'Exported!' : 'Export to Excel'}
                        </button>
                    </div>
                )}
            </div>

            {/* === ADD COURSE MODAL === */}
            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {/* === ADD PROGRAM MODAL === */}
            {showProgramModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleProgramChange}
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            {/* === PAGE CONTENT === */}
            <div className={styles.pageWrapper}>

                {/* === LEFT SIDE: COURSE LIST === */}
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                        onEditCourse={role === 'admin' ? startEditingCourse : null}
                    />
                </div>

                {/* === ADMIN-ONLY RIGHT SIDE: PROGRAM LIST === */}
                {role === 'admin' && (
                    <div className={styles.rightSection}>
                        <p><b>Student Programs</b></p>
                        <br />
                        <ProgramList
                            programs={programs}
                            onDeleteProgram={handleDeleteProgram}
                            onEditProgram={(groupTitle) => {
                                startEditingProgram(groupTitle);
                                console.log('Edit program:', groupTitle);
                            }}
                        />
                    </div>
                )}

                {/* === STUDENT-ONLY RIGHT SIDE: ELECTIVE FORM === */}
                {role !== 'admin' && (
                    <div className={styles.rightSection}>

                        {/* Tabs to switch between tech and hum */}
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'tech' ? styles.active : ''}`}
                                onClick={() => setActiveTab('tech')}
                            >
                                Technical
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'hum' ? styles.active : ''}`}
                                onClick={() => setActiveTab('hum')}
                            >
                                Humanities
                            </button>
                        </div>

                        {/* Electives form to submit selected courses */}
                        <ElectivesForm
                            type={activeTab}
                            onSubmit={(selectedCourses) => onSubmit(selectedCourses, activeTab)}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default CataloguePage;
