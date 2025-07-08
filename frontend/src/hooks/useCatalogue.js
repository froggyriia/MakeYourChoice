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
    getCourseInfo,
    archiveCourse,
    unarchiveCourse
} from '../api/functions_for_courses.js';
import { getUserProgram } from '../api/functions_for_users.js';

export const useCatalogue = () => {
    const { email, currentRole } = useAuth();

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

    const [courseTypeFilter, setCourseTypeFilter] = useState('tech');

    // Load and filter courses
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
            setError(err.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) loadCourses();
    }, [email, filters, courseTypeFilter, currentRole]);

    // Start editing existing course
    const startEditingCourse = async (courseId) => {
        let course = courses.find(c => c.id === courseId);
        if (!course) {
            try {
                course = await getCourseInfo(courseId);
            } catch {
                setError('Failed to load course for editing');
                return;
            }
        }
        setCurrentCourse({
            ...course,
            years: course.years || [],
            program: (course.program || []).map(String)
        });
        setShowAddForm(true);
    };

    // Start adding new course
    const startAddingCourse = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(true);
    };

    // Toggle year in form
    const handleYearsChange = year => {
        setCurrentCourse(prev => {
            const updated = prev.years.includes(year)
                ? prev.years.filter(y => y !== year)
                : [...prev.years, year];
            return { ...prev, years: updated };
        });
    };

    // Handle generic field change
    const handleChange = ({ name, value }) => {
        setCurrentCourse(prev => ({ ...prev, [name]: value }));
    };

    // Submit add/edit form
    const handleSubmit = async () => {
        try {
            const cleaned = {
                ...currentCourse,
                years: (currentCourse.years || []).map(String),
                program: (currentCourse.program || []).map(String)
            };
            if (cleaned.id) {
                const updated = await editCourseInfo(cleaned);
                setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
            } else {
                const { data, error } = await addCourse(cleaned);
                if (error) throw error;
                setCourses(prev => [...prev, data[0]]);
            }
            setCurrentCourse(initialCourse);
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    // Cancel form
    const handleCancel = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(false);
        setError(null);
    };

    // Delete course locally
    const handleDeleteCourse = id => {
        setCourses(prev => prev.filter(c => c.id !== id));
    };

    // Archive/unarchive course
    const handleArchiveCourse = async (id, currentStatus) => {
        try {
            if (currentStatus) await unarchiveCourse(id);
            else await archiveCourse(id);
            loadCourses();
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to change archive status');
        }
    };

    return {
        courses,
        setCourses,
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
        refetch: loadCourses
    };
};
