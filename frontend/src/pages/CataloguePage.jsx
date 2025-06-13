import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from "../components/SidebarMenu.jsx";
import mockCourses from '../utils/fakeCoursesDB.js';
import AddCourseModal from "../components/AddCourseModal.jsx";
import styles from './CataloguePage.module.css';

const CataloguePage = () => {
    const [courses, setCourses] = useState(mockCourses);
    const [showAddForm, setShowAddForm] = useState(false);
    const { role } = useAuth();
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        teacher: '',
        language: 'Rus',
        program: 'Rus Program',
        type: 'tech',
        years: [],
    });

    const handleYearsChange = (e) => {
        const year = parseInt(e.target.value);
        setNewCourse(prev => {
            const years = prev.years.includes(year)
                ? prev.years.filter(y => y !== year)
                : [...prev.years, year];
            return { ...prev, years };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCourses(prev => [...prev, { ...newCourse, id: Date.now() }]);
        setNewCourse({
            title: '',
            description: '',
            teacher: '',
            language: 'Rus',
            program: 'Rus Program',
            type: 'tech',
            years: [],
        });
        setShowAddForm(false);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setNewCourse({
            title: '',
            description: '',
            teacher: '',
            language: 'Rus',
            program: 'Rus Program',
            type: 'tech',
            years: [],
        });
    };

    const handleDeleteCourse = (courseId) => {
        setCourses(courses.filter(course => course.id !== courseId));
    };

    return (
        <>
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
                    newCourse={newCourse}
                    onChange={handleChange}
                    onYearsChange={handleYearsChange}
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