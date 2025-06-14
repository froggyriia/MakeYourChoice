// hooks/useCatalogue.js
import { useState, useEffect } from 'react';
import { fetchCourses, addCourse } from '../api/functions_for_courses.js';

export const useCatalogue = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const initialCourse = {
        title: '',
        description: '',
        teacher: '',
        language: 'Rus',
        program: ['Rus Program'],
        type: 'tech',
        years: [],
    };

    const [newCourse, setNewCourse] = useState(initialCourse);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const data = await fetchCourses();
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

    const handleYearsChange = (year) => {
        setNewCourse((prev) => {
            const years = prev.years.includes(year)
                ? prev.years.filter(y => y !== year)
                : [...prev.years, year];
            return { ...prev, years };
        });
    };

    const handleChange = ({ name, value }) => {
        setNewCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const { data, error } = await addCourse(newCourse);
            if (error) throw error;
            setCourses((prev) => [...prev, data[0]]);
            setNewCourse(initialCourse);
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setNewCourse(initialCourse);
        setShowAddForm(false);
    };

    const handleDeleteCourse = (id) => {
        setCourses((prev) => prev.filter(c => c.id !== id));
    };

    return {
        courses,
        loading,
        error,
        newCourse,
        setShowAddForm,
        showAddForm,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse
    };
};
