/**
 * AdminCoursesPage
 *
 * Displays and manages the list of elective courses.
 * Includes modal for adding/editing courses.
 */

import { useRef } from 'react';
import CourseList from '../components/CourseList';
import AddCourseModal from '../components/AddCourseModal';
import { useCatalogueContext } from '../context/CatalogueContext';

const AdminCoursesPage = () => {
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
    } = useCatalogueContext().catalogue;

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

            <CourseList
                courses={courses}
                onDeleteCourse={handleDeleteCourse}
                onEditCourse={startEditingCourse}
            />
        </>
    );
};

export default AdminCoursesPage;
