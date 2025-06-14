//CataloguePage.jsx

import Header from '../components/Header';
import SidebarMenu from '../components/SidebarMenu';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import { useAuth } from '../context/AuthContext';
import styles from './CataloguePage.module.css';
import { useCatalogue } from '../hooks/useCatalogue';

const CataloguePage = () => {
    const { role } = useAuth();
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

    return (
        <>
            <Header />
            <div className={styles.headerContainer}>
                <div className={styles.titleContainer}>Course Catalogue</div>
                {role === 'admin' && (
                    <button
                        className={styles.addCourseButton}
                        onClick={() => setShowAddForm(true)}
                    >
                        Add course
                    </button>
                )}
            </div>

            {showAddForm && (
                <AddCourseModal
                    course={newCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}


            <div className={styles.pageWrapper}>
                <SidebarMenu />
                <CourseList
                    courses={courses}
                    onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}
                />
            </div>
        </>
    );
};

export default CataloguePage;