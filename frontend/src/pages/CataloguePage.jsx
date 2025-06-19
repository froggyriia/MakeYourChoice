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
    const { role, email } = useAuth();
    const scrollPosition = useRef(0);
    const [activeTab, setActiveTab] = useState('tech');

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

    const { isExported, exportToExcel } = useExcelExport();
    const { onSubmit } = useFormSubmit(email);

    // Данные и функции по программам студентов из usePrograms
    const {
        programs,
        programData,
        showModal: showProgramModal,
        setShowModal: setShowProgramModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        handleDeleteProgram,
        startEditingProgram,

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
                    <div className={styles.adminActions}>
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
                        <button
                            onClick={exportToExcel}
                            className={styles.exportButton}
                        >
                            {isExported ? 'Exported!' : 'Export to Excel'}
                        </button>
                    </div>
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
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                        onEditCourse={role === 'admin' ? startEditingCourse : null}
                    />
                </div>
                {role === 'admin' && (
                    <div className={styles.leftSection}>
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

                {role !== 'admin' && (
                    <div className={styles.rightSection}>
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