/**
 * useCatalogue.js
 *
 * Custom React hook to manage course catalogue operations:
 * - Fetching, filtering, editing, and adding courses
 * - Handles state for course form, filters, and async status
 * - Integrates with AuthContext to filter data based on user role
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    fetchCourses,
    addCourse,
    editCourseInfo,
    getCourseInfo, archivedCourses, archiveCourse, unarchiveCourse
} from '../api/functions_for_courses.js';
import { isAdmin } from '../hooks/validation.js';
import { getUserProgram } from '../api/functions_for_users.js'

export const useCatalogue = () => {
    const { email,currentRole } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [viewMode, setViewMode] = useState('full');

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

    const [filters, setFilters] = useState({
        types: [],
        programs: [],
        languages: [],
        years: []
    });

    const [courseTypeFilter, setCourseTypeFilter] = useState('tech'); // 'tech', 'hum', or null

    const loadCourses = async () => {
        try {
            setLoading(true);
            const isUserAdmin = currentRole === 'admin';

            const activeFilters = { ...filters };
            if (!isUserAdmin && courseTypeFilter) {
                activeFilters.types = [courseTypeFilter];
            }

            const data = await fetchCourses(email, isUserAdmin, activeFilters);

            setCourses(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setCourses([]);
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) {
            loadCourses();
        }
    }, [email, filters, courseTypeFilter, currentRole]);

    const startEditingCourse = async (courseId) => {
        let course = courses.find((c) => c.id === courseId);
        if (!course) {
            try {
                course = await getCourseInfo(courseId);
            } catch {
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
            const updated = prev.years.includes(yearInt)
                ? prev.years.filter((y) => y !== yearInt)
                : [...prev.years, yearInt];
            return { ...prev, years: updated };
        });
    };

    const handleChange = ({ name, value }) => {
        setCurrentCourse((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const cleaned = {
                ...currentCourse,
                years: (currentCourse.years || []).map(Number),
                program: (currentCourse.program || []).map(String),
            };

            if (cleaned.id) {
                const updated = await editCourseInfo(cleaned);
                setCourses((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c))
                );
            } else {
                const { data, error } = await addCourse(cleaned);
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

    const handleArchiveCourse = async (id, currentStatus) => {
        try {
            if (currentStatus) {
                await unarchiveCourse(id);
            } else {
                await archiveCourse(id);
            }
            await loadCourses();
        } catch (err) {
            console.error('Error archiving/unarchiving course:', err);
            setError(err.message || 'Failed to change archive status');
        }
    };

    return {
        courses,
        loading,
        error,
        showAddForm,
        currentCourse,
        filters,
        courseTypeFilter,
        viewMode,

        setShowAddForm,
        setFilters,
        setCourseTypeFilter,
        setViewMode,

        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse,
        startEditingCourse,
        startAddingCourse,
        handleArchiveCourse,

        refetch: loadCourses,
    };
};
