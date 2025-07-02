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
        shortName: '',
        techCount: 0,
        humCount: 0,
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
     * Deletes a program both in Supabase and locally.
     *
     * @param {number|string} programIdOrTitle - ID или student_group программы
     */
    const handleDeleteProgram = async (programIdOrTitle) => {

        try {
            const found = programs.find(
                (p) => p.id === programIdOrTitle || p.student_group === programIdOrTitle
            );

            if (!found) {
                console.warn('No program found');
                return;
            }

            await deleteProgram(found.title);

            setPrograms((prev) => prev.filter((p) => p.id !== found.id));
        } catch (e) {
            console.error('Error occurred while program deleting:', e.message);
            setError(e.message);
        }
    };


    /**
     * Handles form submission for creating or editing a program.
     *
     * @async
     * @returns {Promise<void>}
     */
    const handleProgramSubmit = async () => {
        try {


            const payload = {
                student_group: programData.shortName,
                tech: parseInt(programData.techCount, 10),
                hum: parseInt(programData.humCount, 10),
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
            shortName: found.student_group,
            techCount: found.tech,
            humCount: found.hum,
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
