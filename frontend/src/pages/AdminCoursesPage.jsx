import { useRef } from 'react';
import CourseList from '../components/CourseList';
import CourseListGrid from '../components/CourseListGrid';
import AddCourseModal from '../components/AddCourseModal';
import { useCatalogueContext } from '../context/CatalogueContext';
import styles from './CataloguePage.module.css';

const AdminCoursesPage = () => {
    const scrollPosition = useRef(0);

    const {
        catalogue: {
            courses,
            currentCourse,
            showAddForm,
            handleChange,
            handleYearsChange,
            handleSubmit,
            handleCancel,
            handleDeleteCourse,
            startAddingCourse,
            startEditingCourse,
            viewMode,
            handleArchiveCourse,
        }
    } = useCatalogueContext();

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            {/* Title and Add course button */}
            <div className={styles.headerContainer}>
                <h2>Elective Courses</h2>
                <button
                    className={styles.addCourseButton}
                    onClick={startAddingCourse}
                >
                    Add Course
                </button>
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

            {/* Course List */}
            {viewMode === 'compact' ? (
                <CourseListGrid courses={courses} />
            ) : (
                <CourseList
                    courses={courses}
                    onDeleteCourse={handleDeleteCourse}
                    onEditCourse={startEditingCourse}
                    onArchiveCourse={handleArchiveCourse}
                />
            )}
        </>
    );
};

export default AdminCoursesPage;