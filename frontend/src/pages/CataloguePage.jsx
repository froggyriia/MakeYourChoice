import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';
import SidebarMenu from "../components/SidebarMenu.jsx";
import mockCourses from '../utils/fakeCoursesDB.js';




const CataloguePage = () => {
    // Состояние курсов, инициализируем заглушкой
    const [courses, setCourses] = useState(mockCourses);
    // Получаем роль пользователя из контекста
    const { role } = useAuth();

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
            {role === 'admin' && <button className="btn">+ Добавить курс</button>}
            {/* Список курсов */}
            <SidebarMenu />
            <CourseList courses={courses} />

        </div>
    );
};

export default CataloguePage;