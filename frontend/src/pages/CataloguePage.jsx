import { useState, useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogue } from '../hooks/useCatalogue';
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
        newCourse,
        showAddForm,
        setShowAddForm,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse
    } = useCatalogue();

    const { isExported, exportToExcel } = useExcelExport();
    const { onSubmit } = useFormSubmit(email);

    const handleAddCourseClick = () => {
        scrollPosition.current = window.scrollY;
        setShowAddForm(true);
    };

    const handleModalCancel = () => {
        handleCancel();
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
                    course={newCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            <div className={styles.pageWrapper}>
                <div className={styles.leftSection}>
                    <CourseList
                        courses={courses}
                        onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                    />
                </div>
                
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