/**
 * AdminCataloguePage
 *
 * This page provides the administrative interface for managing:
 * - The course catalogue (create, edit, delete courses)
 * - Student programs (add/edit/delete groups of programs)
 *
 * Only accessible by users with an 'admin' role.
 * Includes modals for course/program management, along with dynamic listings.
 */

import { useRef } from 'react';
import HeaderLayout from '../components/HeaderLayout';
import CourseList from '../components/CourseList';
import ProgramList from '../components/ProgramList';
import AddCourseModal from '../components/AddCourseModal';
import AddStudentsProgramModal from '../components/AddStudentProgramModal';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import CourseListGrid from "../components/CourseListGrid.jsx";

const AdminCataloguePage = () => {
    const { role } = useAuth();
    const { catalogue, programs } = useCatalogueContext();
    const { viewMode } = catalogue;

    // Block access if user is not an admin
    if (role !== 'admin') return <p>Access denied</p>;

    const scrollPosition = useRef(0);

    // Access course and program catalogue state


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

    /**
     * Handles cancellation of the Add/Edit Course modal.
     * Resets course form and scrolls back to previous position.
     */
    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    /**
     * Handles cancellation of the Add/Edit Program modal.
     * Resets program form and scrolls back to previous position.
     */
    const handleProgramModalCancel = () => {
        handleProgramCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            {/* Sticky header */}
            <HeaderLayout />

            {/* Course modal (shown when adding or editing) */}
            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {/* Program modal (shown when adding or editing) */}
            {showProgramModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleProgramChange}
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            {/* Main layout: left = courses, right = programs */}
            <div className={styles.pageWrapper}>
                {/* Course management */}
                <div className={styles.leftSection}>
                    {catalogue.viewMode === 'compact' && (
                        <CourseListGrid courses={courses} onTileClick={(id) => console.log("Clicked:", id)} />
                    )}
                    {catalogue.viewMode !== 'compact' && (
                        <CourseList
                            courses={courses}
                            onDeleteCourse={handleDeleteCourse}
                            onEditCourse={startEditingCourse}
                        />
                    )}



                </div>

                {/* Program management */}
                <div className={styles.rightSection}>
                    <p><b>Student Programs</b></p>
                    <br />
                    <ProgramList
                        programs={programList}
                        onDeleteProgram={handleDeleteProgram}
                        onEditProgram={startEditingProgram}
                    />
                </div>
            </div>
        </>
    );
};

export default AdminCataloguePage;
