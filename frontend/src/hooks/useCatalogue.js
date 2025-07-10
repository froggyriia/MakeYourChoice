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

    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [viewMode, setViewMode] = useState('full');

    const [programFilter, setProgramFilter] = useState('all');

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
    const isUserAdmin = currentRole === 'admin';

    // Load and filter courses
    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await fetchCourses(email, isUserAdmin);
            setAllCourses(data);
            setError(null);
            return data;
        } catch (err) {
            console.error(err);
            setAllCourses([]);
            setError(err.message || 'Failed to load courses');
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (allCourses.length === 0) return;

        const filtered = allCourses.filter(course => {
            const studentTypeMatch = !isUserAdmin ? course.type === courseTypeFilter : true;

        const adminTypeMatch = filters.types.length === 0 ||
                            filters.types.includes(course.type);

        const typeMatch = isUserAdmin ? adminTypeMatch : studentTypeMatch;


            const programMatch = filters.programs.length === 0 ||
                (course.program && course.program.some(p =>
                    filters.programs.includes(p)));

            const languageMatch = filters.languages.length === 0 ||
                filters.languages.includes(course.language);

            const yearsMatch = filters.years.length === 0 ||
                (course.years && course.years.some(y =>
                    filters.years.includes(y)));

            const archiveMatch = typeof filters.isArchived !== 'boolean' ||
                course.archived === filters.isArchived;

            return typeMatch && programMatch && languageMatch &&
                   yearsMatch && archiveMatch;
        });

        setFilteredCourses(filtered);
    }, [allCourses, filters, courseTypeFilter]);

    const updateFilter = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            types: [],
            programs: [],
            languages: [],
            years: [],
            isArchived: undefined
        });
        setCourseTypeFilter('tech');
    };

    const updateCourseInLocalState = (updatedCourse) => {
        setAllCourses(prev =>
            prev.map(c => c.id === updatedCourse.id ? updatedCourse : c)
        );
    };

    const addCourseToLocalState = (newCourse) => {
        setAllCourses(prev => [...prev, newCourse]);
    };

    const handleSubmit = async () => {
        try {
            const cleaned = {
                ...currentCourse,
                years: (currentCourse.years || []).map(String),
                program: (currentCourse.program || []).map(String)
            };
            if (cleaned.id) {
                const updated = await editCourseInfo(cleaned);
                updateCourseInLocalState(updated);
            } else {
                const { data, error } = await addCourse(cleaned);
                if (error) throw error;
                addCourseToLocalState(data[0]);
            }
            setCurrentCourse(initialCourse);
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
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

    // Cancel form
    const handleCancel = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(false);
        setError(null);
    };

    // Delete course locally
    const handleDeleteCourse = id => {
        setAllCourses(prev => prev.filter(c => c.id !== id));
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
        courses: filteredCourses,
        setCourses: setAllCourses,
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
        programFilter,
        setProgramFilter
    };
};
