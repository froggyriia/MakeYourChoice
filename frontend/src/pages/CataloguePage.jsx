import { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';
import { useAuth } from '../context/AuthContext';

// Заглушка курсов — позже будем загружать с сервера
const mockCourses = [
    { id: 1, title: 'Math 101', description: 'Intro to Math', language: 'Eng', program: 'Eng Program', years: [1, 2] },
    { id: 2, title: 'История России', description: 'Прошлое и настоящее', language: 'Rus', program: 'Rus Program', years: [1] }
];

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
            <CourseList courses={courses} />
        </div>
    );
};

export default CataloguePage;