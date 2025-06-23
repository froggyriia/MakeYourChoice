import { useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import ProgramList from '../components/ProgramList';
import AddCourseModal from '../components/AddCourseModal';
import AddStudentsProgramModal from '../components/AddStudentProgramModal';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';

const AdminCataloguePage = () => {
    const { role } = useAuth();
    const { catalogue, programs } = useCatalogueContext();
    const scrollPosition = useRef(0);

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

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    const handleProgramModalCancel = () => {
        handleProgramCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    if (role !== 'admin') return <p>Access denied</p>;

    return (
        <>
            <Header />

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
                    onChange={handleProgramChange}
                    onSubmit={handleProgramSubmit}
                    onCancel={handleProgramModalCancel}
                />
            )}

            <div className={styles.pageWrapper}>
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={handleDeleteCourse}
                        onEditCourse={startEditingCourse}
                    />
                </div>

                <div className={styles.rightSection}>
                    <p><b>Student Programs</b></p>
                    <br />
                    <ProgramList
                        programs={programList}
                        onDeleteProgram={handleDeleteProgram}
                        onEditProgram={(groupTitle) => {
                            startEditingProgram(groupTitle);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default AdminCataloguePage;
