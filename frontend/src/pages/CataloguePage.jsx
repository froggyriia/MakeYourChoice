import { useState, useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import ProgramList from '../components/ProgramList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogueContext } from '../context/CatalogueContext.jsx'; // <-- use context here
import AddStudentsProgramModal from '../components/AddStudentProgramModal.jsx';
import ElectivesForm from '../components/ElectivesForm';
import { useFormSubmit } from '../hooks/useFormSubmit';

const CataloguePage = () => {
    // Get current user's role and email from Auth context
    const { role, email } = useAuth();

    // Get shared state and handlers from CatalogueContext
    const { catalogue, programs, excelExport } = useCatalogueContext();

    // Student form submission hook (depends on email)
    const { onSubmit } = useFormSubmit(email);

    // Local state to track active tab for electives form (technical/humanities)
    const [activeTab, setActiveTab] = useState('tech');

    // Store scroll position for restoring after modals close
    const scrollPosition = useRef(0);

    // Destructure catalogue state and handlers
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

    // Destructure programs state and handlers
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

    // Destructure excel export
    const { isExported, exportToExcel } = excelExport;

    // Handlers to save scroll position and open modals
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

            {/* Add/Edit Course Modal */}
            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {/* Add/Edit Student Program Modal */}
            {showProgramModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleProgramChange}
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            {/* Main page content layout */}
            <div className={styles.pageWrapper}>
                {/* Left side: course list, available for all users */}
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                        onEditCourse={role === 'admin' ? startEditingCourse : null}
                    />
                </div>

                {/* Right side for admins: manage student programs */}
                {role === 'admin' && (
                    <div className={styles.rightSection}>
                        <p><b>Student Programs</b></p>
                        <br />
                        <ProgramList
                            programs={programList}
                            onDeleteProgram={handleDeleteProgram}
                            onEditProgram={(groupTitle) => {
                                startEditingProgram(groupTitle);
                                console.log('Edit program:', groupTitle);
                            }}
                        />
                    </div>
                )}

                {/* Right side for students: elective course selection form */}
                {role !== 'admin' && (
                    <div className={styles.rightSection}>
                        {/* Tabs to switch between technical and humanities electives */}
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

                        {/* Electives selection form with submit handler */}
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
