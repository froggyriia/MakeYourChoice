import { useState, useRef } from 'react';
import Header from '../components/Header';
import SidebarMenu from '../components/SidebarMenu';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogue } from '../hooks/useCatalogue';
import { usePrograms} from "../hooks/usePrograms.js";
import AddStudentsProgramModal from "../components/AddStudentProgramModal.jsx";

const CataloguePage = () => {
    const { role } = useAuth();
    const scrollPosition = useRef(0);
    const {
        courses,
        loading,
        error,
        currentCourse,
        showAddForm,
        setShowAddForm,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse,
        startEditingCourse,
        startAddingCourse
    } = useCatalogue();

    // Данные и функции по программам студентов из usePrograms
    const {
        programData,
        showModal: showProgramModal,
        setShowModal: setShowProgramModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        error: programError,
    } = usePrograms();


    const handleAddCourseClick = () => {
        scrollPosition.current = window.scrollY;
        startAddingCourse();
    };

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    const handleProgramModalCancel = () => {
        handleProgramCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            <Header />
            <div className={styles.headerContainer}>
                <div className={styles.titleContainer}>Course Catalogue</div>
                {role === 'admin' && (
                <>
                    <button
                        className={styles.addCourseButton}
                        onClick={handleAddCourseClick}
                    >
                        Add course
                    </button>

                    <button
                        className={styles.addCourseButton}
                        onClick={() => setShowProgramModal(true)}
                    >
                        Add Student Program
                    </button>
                </>
                )}
            </div>

            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {showProgramModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleProgramChange}     // <--- вот здесь onChange
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            <div className={styles.pageWrapper}>
                <SidebarMenu />
                <CourseList
                    courses={courses}
                    onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                    onEditCourse={role === 'admin' ? startEditingCourse : null}
                />
            </div>
        </>
    );
};

export default CataloguePage;