/**
 * Custom React hook for managing the course catalogue state and operations.
 *
 * Provides functionality to fetch, add, edit, and delete courses.
 * Manages loading and error states, and controls form visibility.
 * Integrates with authentication to fetch data relevant to the current user.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx'
import {
    fetchCourses,
    addCourse,
    editCourseInfo,
    getCourseInfo,
    filterCourses
} from '../api/functions_for_courses.js';

import { isAdmin} from "../utils/validation.js";

export const useCatalogue = () => {
    // State for list of courses
    const [courses, setCourses] = useState([]);
    // State to indicate loading status for async operations
    const [loading, setLoading] = useState(false);
    // State to hold error messages
    const [error, setError] = useState(null);
    // State to control visibility of the add/edit form
    const [showAddForm, setShowAddForm] = useState(false);
    // Get current user's email from Auth context
    const { email, role } = useAuth();

    // Template for a new course with default values
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

    // Filter state 'tech' | 'hum' | null
    const [courseTypeFilter, setCourseTypeFilter] = useState('tech');




    // State for currently editing or adding course
    const [currentCourse, setCurrentCourse] = useState(initialCourse);

    /**
     * Fetches courses from the backend API when the component mounts.
     * Uses the current user's email and admin status to determine data scope.
     * Handles loading and error states during fetch.
     */
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const isUserAdmin = isAdmin(email);

                // Combine courseTypeFilter + other filters
                const activeFilters = { ...filters };
                if (courseTypeFilter) {
                    activeFilters.types = [courseTypeFilter];
                }

                // If any filters applied, use filterCourses; otherwise fetch all
                let data;
                const hasFilters = Object.values(activeFilters).some(val => val?.length > 0);

                if (hasFilters) {
                    data = await filterCourses(activeFilters);
                } else {
                    data = await fetchCourses(email, isUserAdmin);
                }

                setCourses(data);
            } catch (err) {
                console.error("Error loading courses:", err);
                setCourses([]);
                setError(err.message || "Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, [email, filters, courseTypeFilter]);

    /**
     * Loads course data for editing based on the course ID.
     * Tries to find the course locally, otherwise fetches from API.
     * Normalizes years and program fields to expected types.
     * Opens the add/edit form with loaded course data.
     *
     * @param {number|string} courseId - ID of the course to edit
     */
    const startEditingCourse = async (courseId) => {
        // Try to find course in current state
        let course = courses.find((c) => c.id === courseId);

        if (!course) {
            try {
                // Fetch course info from API if not found locally
                course = await getCourseInfo(courseId);
            } catch (e) {
                setError('Failed to load course for editing');
                return;
            }
        }
        // Normalize data types for form consistency
        const normalizedCourse = {
            ...course,
            years: (course.years || []).map(Number),
            program: (course.program || []).map(String),
        };

        setCurrentCourse(normalizedCourse);
        setShowAddForm(true);
    };

    /**
     * Initializes adding a new course by resetting form state.
     * Opens the add course form with default initialCourse values.
     */
    const startAddingCourse = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(true);
    };
    /**
     * Handles toggling year selection in the current course's years array.
     * If the year is already selected, removes it; otherwise adds it.
     *
     * @param {string|number} year - The year to toggle in the course years
     */
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

    /**
     * Handles generic input changes in the current course form.
     * Updates the currentCourse state with new name/value pair.
     *
     * @param {Object} param0
     * @param {string} param0.name - Name of the field to update
     * @param {any} param0.value - New value for the field
     */
    const handleChange = ({ name, value }) => {
        setCurrentCourse((prev) => ({ ...prev, [name]: value }));
    };
    /**
     * Submits the current course to the API for adding or updating.
     * Cleans up the course data, ensuring correct types.
     * Updates the course list in state accordingly.
     * Handles any errors by setting error state.
     */
    const handleSubmit = async () => {
        try {
            // Normalize course data before sending
            const cleanedCourse = {
                ...currentCourse,
                years: (currentCourse.years || []).map(Number),
                program: (currentCourse.program || []).map(String),
            };

            if (cleanedCourse.id) {
                // Edit existing course
                const updatedCourse = await editCourseInfo(cleanedCourse);
                // Replace course in state with updated version
                setCourses((prev) =>
                    prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
                );
            } else {
                // Add new course
                const { data, error } = await addCourse(cleanedCourse);
                if (error) throw error;
                // Append new course to state list
                setCourses((prev) => [...prev, data[0]]);
            }
            // Reset form and hide it after submission
            setCurrentCourse(initialCourse);
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };
    /**
     * Cancels adding or editing and resets form state.
     * Hides the add/edit form and clears errors.
     */
    const handleCancel = () => {
        setCurrentCourse(initialCourse);
        setShowAddForm(false);
        setError(null);
    };
    /**
     * Removes a course from the course list state by ID.
     * Does not call API delete here; expected to be called after deletion.
     *
     * @param {number|string} id - ID of the course to remove
     */
    const handleDeleteCourse = (id) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };
    // Return all relevant state and handlers to be used in components
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
        courseTypeFilter,
        setCourseTypeFilter,
        filters,
        setFilters,
    };
};
