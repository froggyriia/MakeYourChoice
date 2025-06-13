import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from "../components/SidebarMenu.jsx";
import AddCourseModal from "../components/AddCourseModal.jsx";
import styles from './CataloguePage.module.css';
import { supabase } from './supabaseClient.jsx';
import { fetchCourses, addCourse } from '../api/functions_for_courses.js';
import Header from '../components/Header.jsx';

const CataloguePage = () => {
    // Добавляем недостающие состояния
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const { role, email } = useAuth();
    console.log('user в каталоге:', role, email);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await addCourse(newCourse);
            if (error) throw error;

            setCourses(prev => [...prev, data[0]]);
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
        } catch (err) {
            setError(err.message);
        }
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

useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);


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
                    newCourse={newCourse}
                    onChange={handleChange}
                    onYearsChange={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}

            <div className={styles.pageWrapper}>
                <SidebarMenu />
                <CourseList courses={courses}
                 onDeleteCourse={role === 'admin' ? handleDeleteCourse : null}/>
            </div>
        </>
    );
};

export default CataloguePage;