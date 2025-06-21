// hooks/usePrograms.js
import {useEffect, useState} from 'react';
import {supabase} from "../utils/supabaseClient.js";
import { addProgram, getProgramInfo, deleteProgram,  editProgramInfo } from '../api/functions_for_programs';

export const usePrograms = () => {
    const initialProgram = {
        stage: 'B',       // B, M, P
        year: new Date().getFullYear(),
        shortName: '',
        techCount: 0,
        humCount: 0,
        deadline: '',     // format: 'YYYY-MM-DDTHH:mm' (datetime-local input)
    };

    const [programData, setProgramData] = useState(initialProgram);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [programs, setPrograms] = useState([]);

    const handleProgramChange = ({ name, value }) => {
        setProgramData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const loadPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('groups_electives')
                .select('*');

            if (error) throw error;
            setPrograms(data || []);
        } catch (e) {
            console.error('Failed to load programs:', e.message);
            setPrograms([]);
        }
    };

    useEffect(() => {
        loadPrograms();
    }, []);

    const handleDeleteProgram = (groupTitle) => {
        setPrograms((prev) => prev.filter((p) => p.student_group !== groupTitle));
    };

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

    const handleProgramCancel = () => {
        setProgramData(initialProgram);
        setShowModal(false);
        setError(null);
    };

    const startEditingProgram = (programIdOrTitle) => {
        const found = programs.find((p) =>
            p.id === programIdOrTitle || p.student_group === programIdOrTitle
        );

        if (!found) {
            console.warn('Программа не найдена для редактирования');
            return;
        }

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
