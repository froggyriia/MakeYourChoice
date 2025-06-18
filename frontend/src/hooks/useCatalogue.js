// hooks/useCatalogue.js
import { useState, useEffect } from 'react';
import {
    fetchCourses,
    addCourse,
    editCourseInfo,
    getCourseInfo,
} from '../api/functions_for_courses.js';

export const useCatalogue = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    // Хранит либо новый курс, либо редактируемый курс
    const initialCourse = {
        id: null,
        title: '',
        description: '',
        teacher: '',
        language: 'Rus',
        program: [],
        type: 'tech',
        years: [],
    };

    const [currentCourse, setCurrentCourse] = useState(initialCourse);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                console.error(err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        loadCourses();
    }, []);

    // Для редактирования: загружаем данные курса из массива или из API (если нужно)
    const startEditingCourse = async (courseId) => {
        // Попытка найти курс в стейте
        let course = courses.find((c) => c.id === courseId);

        // Если не нашли, загрузим из API (на всякий случай)
        if (!course) {
            try {
                course = await getCourseInfoById(courseId); // если есть такая функция, или getCourseInfo(title)
            } catch (e) {
                setError('Failed to load course for editing');
                return;
            }
        }

        // Заполняем форму курсом для редактирования
        setCurrentCourse(course);
        setShowAddForm(true);
    };

    // Для создания нового курса (очистка формы)
    const startAddingCourse = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(true);
    };

    const handleYearsChange = (year) => {
        setCurrentCourse((prev) => {
            const years = prev.years.includes(year)
                ? prev.years.filter((y) => y !== year)
                : [...prev.years, year];
            return { ...prev, years };
        });
    };

    const handleChange = ({ name, value }) => {
        setCurrentCourse((prev) => ({ ...prev, [name]: value }));
    };

    // Отправка формы: создаем или обновляем
    const handleSubmit = async () => {
        try {
            if (currentCourse.id) {
                // Редактирование существующего курса
                const updatedCourse = await editCourseInfo(currentCourse);
                setCourses((prev) =>
                    prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
                );
            } else {
                // Добавление нового курса
                const { data, error } = await addCourse(currentCourse);
                if (error) throw error;
                setCourses((prev) => [...prev, data[0]]);
            }
            setCurrentCourse(initialCourse);
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(false);
        setError(null);
    };

    const handleDeleteCourse = (id) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    return {
        courses,
        loading,
        error,
        currentCourse,
        setShowAddForm,
        showAddForm,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse,
        startEditingCourse,
        startAddingCourse,
    };
};
