import { useState, useEffect, useRef } from 'react';
import CourseList from '../components/CourseList';
import ElectivesForm from '../components/ElectivesForm';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import styles from './CataloguePage.module.css';
import HeaderLayout from "../components/HeaderLayout.jsx";
import { isStudentAllowedInSemester, getSemesterById } from '../api/functions_for_semesters.js';

const StudentCataloguePage = () => {
    const { currentRole, email, currentSemId } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { onSubmit } = useFormSubmit(email);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [isAllowed, setIsAllowed] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollPosition = useRef(0);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                if (!currentSemId || currentRole !== 'student') {
                    setIsAllowed(false);
                    setLoading(false);
                    return;
                }

                const semester = await getSemesterById(currentSemId);
                setCurrentSemester(semester);
                
                const allowed = await isStudentAllowedInSemester(email, semester);
                setIsAllowed(allowed);
            } catch (error) {
                console.error('Access check failed:', error);
                setIsAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [currentSemId, currentRole, email]);

    const { courses, courseTypeFilter } = catalogue;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (currentRole !== 'student' || !isAllowed) {
        return <p>Access denied</p>;
    }

    return (
        <>
            <HeaderLayout />
            <div className={styles.pageWrapper}>
                <div className={styles.leftSection}>
                    <CourseList courses={courses} />
                </div>
                <div className={styles.rightSection}>
                    <ElectivesForm
                        type={courseTypeFilter}
                        onSubmit={(selectedCourses) => onSubmit(selectedCourses, courseTypeFilter)}
                    />
                </div>
            </div>
        </>
    );
};

export default StudentCataloguePage;