import React from "react";
import { useState, useEffect, useRef } from 'react';
import CourseList from '../components/CourseList';
import ElectivesForm from '../components/ElectivesForm';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import styles from './CataloguePage.module.css';
import HeaderLayout from "../components/HeaderLayout.jsx";
import { isStudentAllowedInSemester, getSemesterById } from '../api/functions_for_semesters.js';
import AccessDenied from '../components/AccessDenied'; // Импорт нового компонента
import {getProgramInfo} from "../api/functions_for_programs.js";
import {fetchCourses} from "../api/functions_for_courses.js";

const StudentCataloguePage = () => {
    const { currentRole, email, currentSemId } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { onSubmit } = useFormSubmit(email);
    const [currentSemester, setCurrentSemester] = useState(null);
    const [isAllowed, setIsAllowed] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollPosition = useRef(0);
    const [minCount, setMinCount] = useState(0);
    const { courses, courseTypeFilter } = catalogue;

    useEffect(() => {
        const checkAccessAndSetMinCount = async () => {
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

                const [allCourses, program] = await Promise.all([
                    fetchCourses(email, false, currentSemId),
                    getProgramInfo(email)
                ]);

                const filtered = allCourses.filter(course => course.type === courseTypeFilter);
                const programCount = courseTypeFilter === 'tech' ? program.tech : program.hum;
                const coursesCount = filtered.length;

                setMinCount(Math.min(programCount, coursesCount));

            } catch (error) {
                console.error('Access check failed:', error);
                setIsAllowed(false);
            } finally {
                setLoading(false);
            }
        };

        checkAccessAndSetMinCount();
    }, [currentSemId, currentRole, email, courseTypeFilter]);



    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Checking access rights...</p>
            </div>
        );
    }

    if (currentRole !== 'student' || !isAllowed) {
        return <AccessDenied />;
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
                        priorityCount={minCount}
                        onSubmit={(selectedCourses, type, semId) => onSubmit(selectedCourses, type, semId, minCount)}
                    />
                </div>
            </div>
        </>
    );
};

export default StudentCataloguePage;