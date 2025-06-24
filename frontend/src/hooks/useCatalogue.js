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
    filterCourses
} from '../api/functions_for_courses.js';
import { isAdmin } from '../utils/validation.js';

export const useCatalogue = () => {
    const { email, role } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

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

    /**
     * Load courses from backend when email, filters, or course type changes.
     * Applies filtering if active; otherwise loads full list for user.
     */
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const isUserAdmin = isAdmin(email);

                const activeFilters = { ...filters };
                if (courseTypeFilter) {
                    activeFilters.types = [courseTypeFilter];
                }

                const hasFilters = Object.values(activeFilters).some(val => val?.length > 0);
                const data = hasFilters
                    ? await filterCourses(activeFilters)
                    : await fetchCourses(email, isUserAdmin);

                setCourses(data);
                setError(null);
            } catch (err) {
                setCourses([]);
                setError(err.message || "Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        if (email) loadCourses();
    }, [email, filters, courseTypeFilter]);

    /**
     * Starts course editing by loading course data by ID
     * Normalizes types for form binding
     */
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

    /** Resets form to initial state and shows the add form */
    const startAddingCourse = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(true);
    };

    /** Toggles year in currentCourse.years */
    const handleYearsChange = (year) => {
        const yearInt = Number(year);
        setCurrentCourse((prev) => {
            const updated = prev.years.includes(yearInt)
                ? prev.years.filter((y) => y !== yearInt)
                : [...prev.years, yearInt];
            return { ...prev, years: updated };
        });
    };

    /** Handles change in any currentCourse input field */
    const handleChange = ({ name, value }) => {
        setCurrentCourse((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Submits current course (new or edited) to backend.
     * Updates local course list and hides the form on success.
     */
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

    /** Cancels add/edit and resets form */
    const handleCancel = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(false);
        setError(null);
    };

    /** Deletes course locally (assumes backend delete succeeded) */
    const handleDeleteCourse = (id) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    return {
        courses,
        loading,
        error,
        showAddForm,
        currentCourse,
        filters,
        courseTypeFilter,
        setShowAddForm,
        setFilters,
        setCourseTypeFilter,
        handleChange,
        handleYearsChange,
        handleSubmit,
        handleCancel,
        handleDeleteCourse,
        startEditingCourse,
        startAddingCourse,
    };
};
