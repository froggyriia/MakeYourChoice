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
import { archivedCourses } from '../api/functions_for_courses.js';

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
            handleArchiveCourse,
        }
    } = useCatalogueContext();

    const handleModalCancel = () => {
        handleCancel();
        window.scrollTo(0, scrollPosition.current);
    };
    // console.log("[AdminCoursesPage] current filtered courses:", courses);
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
                    // onTileClick={(id) => console.log("Clicked:", id)}
                />
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
