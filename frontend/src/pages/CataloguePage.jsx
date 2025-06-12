import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from "../components/SidebarMenu.jsx";
import mockCourses from '../utils/fakeCoursesDB.js';
import AddCourseModal from "../components/AddCourseModal.jsx";




const CataloguePage = () => {
    // Состояние курсов, инициализируем заглушкой
    const [courses, setCourses] = useState(mockCourses);
    const [showAddForm, setShowAddForm] = useState(false);
    // Получаем роль пользователя из контекста
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
        //во здесь нудно делать POST запрос на дб -> добавлять курс там
        setCourses(prev => [...prev, { ...newCourse, years: [], id: Date.now() }]);
        setNewCourse({
            title: '',
            description: '',
            teacher: '',
            language: 'ru',
            program: 'first',
        });
        setShowAddForm(false);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setNewCourse({
            title: '',
            description: '',
            teacher: '',
            language: 'ru',
            program: 'first',
        });
    };

    // В будущем здесь можно сделать useEffect для загрузки курсов с бэка
    /*
    useEffect(() => {
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => setCourses(data))
        .catch(err => console.error('Ошибка загрузки курсов', err));
    }, []);
    */

    return (
        <div>

            <h1>Каталог курсов</h1>
            {/* Кнопка добавления курса видна только админам */}
            {role === 'admin' &&
                <button className="btn" onClick={() => setShowAddForm(true)}>
                    + Добавить курс
                </button>}

            {showAddForm && (
                <AddCourseModal
                    newCourse={newCourse}
                    onChange={handleChange}
                    onYearsChange={handleYearsChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}

            <SidebarMenu />
            <CourseList courses={courses} />

        </div>
    );
};

export default CataloguePage;