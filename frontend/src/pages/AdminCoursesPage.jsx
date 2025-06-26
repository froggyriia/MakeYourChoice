/**
 * AdminCoursesPage
 *
 * Displays and manages the list of elective courses.
 * Includes modal for adding/editing courses.
 */

import { useRef } from 'react';
import CourseList from '../components/CourseList';
import CourseListGrid from '../components/CourseListGrid';
import AddCourseModal from '../components/AddCourseModal';
import { useCatalogueContext } from '../context/CatalogueContext';

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
            startEditingCourse,
            viewMode,
        }
    } = useCatalogueContext();

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };

    return (
        <>
            <h2>Elective Courses</h2>

            {showAddForm && (
                <AddCourseModal
                    course={currentCourse}
                    onChange={handleChange}
                    onToggleYear={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleModalCancel}
                />
            )}

            {viewMode === 'compact' ? (
                <CourseListGrid
                    courses={courses}
                    onTileClick={(id) => console.log("Clicked:", id)}
                />
            ) : (
                <CourseList
                    courses={courses}
                    onDeleteCourse={handleDeleteCourse}
                    onEditCourse={startEditingCourse}
                />
            )}
        </>
    );
};

export default AdminCoursesPage;
