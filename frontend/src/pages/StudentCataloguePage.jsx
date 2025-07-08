/**
 * StudentCataloguePage
 *
 * This page allows students to:
 * - Browse available courses filtered by type (technical/humanities)
 * - Submit elective course selections
 *
 * Restricted to users with a 'student' role.
 */

import { useRef } from 'react';
import CourseList from '../components/CourseList';
import ElectivesForm from '../components/ElectivesForm';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import styles from './CataloguePage.module.css';
import HeaderLayout from "../components/HeaderLayout.jsx";

const StudentCataloguePage = () => {
    const { currentRole, email } = useAuth(); // Get auth info
    const { catalogue } = useCatalogueContext(); // Course state
    const { onSubmit } = useFormSubmit(email); // Hook for handling form submission
    const scrollPosition = useRef(0); // For potential scroll restoration

    const {
        courses,
        courseTypeFilter,
    } = catalogue;
    console.log("[StudentCataloguePage] current visible courses:", courses);
    console.log("[StudentCataloguePage] current courseTypeFilter:", courseTypeFilter);


    // Only students are allowed to access this page
    if (currentRole === 'admin') return <p>Access denied</p>;

    return (
        <>
            {/* Fixed header with filter tabs */}
            <HeaderLayout />

            {/* Main layout: Left = course list, Right = form submission */}
            <div className={styles.pageWrapper}>
                <div className={styles.leftSection}>
                    <CourseList courses={courses} />
                </div>

                <div className={styles.rightSection}>
                    <ElectivesForm
                        type={courseTypeFilter}
                        /**
                         * Handles elective course form submission.
                         * Sends selected course IDs with the current filter type.
                         * @param {Array<string|number>} selectedCourses - Array of selected course IDs
                         */
                        onSubmit={(selectedCourses) => onSubmit(selectedCourses, courseTypeFilter)}
                    />
                </div>
            </div>
        </>
    );
};

export default StudentCataloguePage;
