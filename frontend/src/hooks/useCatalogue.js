// hooks/useCatalogue.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx'
import {
    fetchCourses,
    addCourse,
    editCourseInfo,
    getCourseInfo,
} from '../api/functions_for_courses.js';

import { isAdmin} from "../utils/validation.js";

export const useCatalogue = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const { email } = useAuth();

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
                const data = await fetchCourses(email, isAdmin(email));
                console.log("Fetched courses:", data);
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

    const startEditingCourse = async (courseId) => {
        let course = courses.find((c) => c.id === courseId);

        if (!course) {
            try {
                course = await getCourseInfo(courseId);
            } catch (e) {
                setError('Failed to load course for editing');
                return;
            }
        }

        const normalizedCourse = {
            ...course,
            years: (course.years || []).map(Number),
            program: (course.program || []).map(String),
        };

        setCurrentCourse(normalizedCourse);
        setShowAddForm(true);
    };


    const startAddingCourse = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(true);
    };

    const handleYearsChange = (year) => {
        const yearInt = Number(year);
        setCurrentCourse((prev) => {
            const prevYears = prev.years.map(Number);
            const years = prevYears.includes(yearInt)
                ? prevYears.filter((y) => y !== yearInt)
                : [...prevYears, yearInt];
            console.log('Old years:', prevYears, 'New years:', years);
            return { ...prev, years };
        });
    };


    const handleChange = ({ name, value }) => {
        setCurrentCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const cleanedCourse = {
                ...currentCourse,
                years: (currentCourse.years || []).map(Number),
                program: (currentCourse.program || []).map(String),
            };

            if (cleanedCourse.id) {
                const updatedCourse = await editCourseInfo(cleanedCourse);
                setCourses((prev) =>
                    prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
                );
            } else {
                const { data, error } = await addCourse(cleanedCourse);
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
