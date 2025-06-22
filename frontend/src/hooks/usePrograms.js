/**
 * usePrograms.js
 *
 * This custom React hook manages the logic for adding, editing, fetching, and deleting academic programs.
 * It communicates with Supabase and helper API functions to persist program data and control UI states
 * such as modals and forms. This hook is typically used in an admin interface for managing student groups.
 */
import {useEffect, useState} from 'react';
import {supabase} from "../utils/supabaseClient.js";
import { addProgram, getProgramInfo, deleteProgram,  editProgramInfo } from '../api/functions_for_programs';

/**
 * Provides state and handlers to manage academic programs and their CRUD operations.
 *
 * @returns {object} State and handler functions for program forms and list updates.
 */
export const usePrograms = () => {
    // Default state for a new or reset program form
    const initialProgram = {
        stage: 'B',       // B, M, P
        year: new Date().getFullYear(),
        shortName: '',
        techCount: 0,
        humCount: 0,
        deadline: '',     // format: 'YYYY-MM-DDTHH:mm' (datetime-local input)
    };

    const [programData, setProgramData] = useState(initialProgram); // Current form values
    const [showModal, setShowModal] = useState(false); // Show/hide modal form
    const [error, setError] = useState(null); // Submission or fetch error
    const [programs, setPrograms] = useState([]); // List of all programs

    /**
     * Handles input changes in the program form.
     *
     * @param {object} param0 - Form field name and value.
     */
    const handleProgramChange = ({ name, value }) => {
        setProgramData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Loads the full list of academic programs from Supabase.
     *
     * @async
     * @returns {Promise<void>}
     */
    const loadPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('groups_electives')
                .select('*');

            if (error) throw error;
            setPrograms(data || []);
        } catch (e) {
            console.error('Failed to load programs:', e.message);
            setPrograms([]); // Reset on failure
        }
    };

    // Load programs once on component mount
    useEffect(() => {
        loadPrograms();
    }, []);

    /**
     * Removes a program from the local state (UI only).
     *
     * @param {string} groupTitle - The title of the group to delete.
     */
    const handleDeleteProgram = (groupTitle) => {
        setPrograms((prev) => prev.filter((p) => p.student_group !== groupTitle));
    };

    /**
     * Handles form submission for creating or editing a program.
     *
     * @async
     * @returns {Promise<void>}
     */
    const handleProgramSubmit = async () => {
        try {
            const deadlineTimestamp = new Date(programData.deadline).toISOString();
            const groupTitle = `${programData.stage}${programData.year.toString().slice(2)}-${programData.shortName}`;

            const payload = {
                student_group: groupTitle,
                tech: parseInt(programData.techCount, 10),
                hum: parseInt(programData.humCount, 10),
                deadline: deadlineTimestamp,
            };

            if (programData.id) {
                const updated = await editProgramInfo({ ...payload, id: programData.id });
                setPrograms((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                );
            } else {
                const { data, error } = await addProgram(payload);
                if (error) throw error;
                setPrograms((prev) => [...prev, data[0]]);
            }

            setProgramData(initialProgram);
            setShowModal(false);
            setError(null);
        } catch (e) {
            console.error(e.message);
            setError(e.message);
        }
    };

    /**
     * Cancels form editing or adding by resetting the form.
     */
    const handleProgramCancel = () => {
        setProgramData(initialProgram);
        setShowModal(false);
        setError(null);
    };

    /**
     * Starts editing a selected program by pre-filling the form with its data.
     *
     * @param {number|string} programIdOrTitle - ID or student group title of the program.
     */
    const startEditingProgram = (programIdOrTitle) => {
        const found = programs.find((p) =>
            p.id === programIdOrTitle || p.student_group === programIdOrTitle
        );

        if (!found) {
            console.warn('Программа не найдена для редактирования');
            return;
        }
        // Parse components from the student_group string (e.g., B24-CS)
        setProgramData({
            stage: found.student_group[0],
            year: 2000 + parseInt(found.student_group.slice(1, 3), 10),
            shortName: found.student_group.slice(4),
            techCount: found.tech,
            humCount: found.hum,
            deadline: new Date(found.deadline).toISOString().slice(0, 16),
            id: found.id,
        });

        setShowModal(true);
    };


    return {
        programs,
        programData,
        showModal,
        setShowModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        handleDeleteProgram,
        startEditingProgram,
        error
    };
};
