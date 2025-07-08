/**
 * AdminProgramsPage
 *
 * Displays and manages student academic programs.
 * Includes modal for adding/editing programs.
 */

import { useRef } from 'react';
import ProgramList from '../components/ProgramList';
import AddStudentsProgramModal from '../components/AddStudentProgramModal';
import { useCatalogueContext } from '../context/CatalogueContext';
import styles from './CataloguePage.module.css';

const AdminProgramsPage = () => {
    const scrollPosition = useRef(0);

    const {
        programs,
        programData,
        showModal,
        handleChange,
        handleSubmit,
        handleCancel,
        handleDeleteProgram,
        startEditingProgram,
        setShowModal,
    } = useCatalogueContext().programs;

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            {/* Title and Add program button */}
            <div className={styles.headerContainer}>
                <h2>Student Programs</h2>
                <button
                    className={styles.addCourseButton}
                    onClick={() => setShowModal(true)}
                >
                    Add Student Program
                </button>
            </div>

            {showModal && (
                <AddStudentsProgramModal
                    programData={programData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            <ProgramList
                programs={programs}
                onDeleteProgram={handleDeleteProgram}
                onEditProgram={startEditingProgram}
            />
        </>
    );
};

export default AdminProgramsPage;
