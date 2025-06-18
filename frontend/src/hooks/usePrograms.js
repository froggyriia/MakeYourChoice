// hooks/usePrograms.js
import { useState } from 'react';
import { addProgram } from '../api/functions_for_programs.js';

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

    const handleProgramChange = ({ name, value }) => {
        setProgramData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProgramSubmit = async () => {
        try {
            const deadlineTimestamp = new Date(programData.deadline).toISOString(); // supabase accepts ISO string
            const groupTitle = `${programData.stage}${programData.year.toString().slice(2)}-${programData.shortName}`;

            const payload = {
                student_group: groupTitle,
                tech: parseInt(programData.techCount, 10),
                hum: parseInt(programData.humCount, 10),
                deadline: deadlineTimestamp,
            };

            const { data, error } = await addProgram(payload);
            if (error) throw error;

            setProgramData(initialProgram);
            setShowModal(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const handleProgramCancel = () => {
        setProgramData(initialProgram);
        setShowModal(false);
    };

    return {
        programData,
        showModal,
        setShowModal,
        handleChange: handleProgramChange,
        handleSubmit: handleProgramSubmit,
        handleCancel: handleProgramCancel,
        error
    };
};
