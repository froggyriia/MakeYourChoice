import { useEffect, useState } from 'react';
import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram, getPrioritiesNumber } from '../api/functions_for_users';

export function useFormSubmit(email) {
    const [studentsPreferences, setStudentsPreferences] = useState([]);
    const [limits, setLimits] = useState({tech : 5, hum : 5});

    useEffect(() => {
        async function fetchLimits() {
            const program = await getUserProgram(email)

            if (!program) return;

            const limits = await getPrioritiesNumber(program);
            setLimits(limits);
        }

        if (email) {
            fetchLimits();
        }
    }, [email]);

    const onSubmit = async (selectedCourses, activeTab) => {
        const expectedCount = limits[activeTab];

        if (selectedCourses.length != expectedCount || selectedCourses.some(c => !c)) {
            alert('Please, fill all priority fields');
            return;
        }

        const currentStudent = studentsPreferences.find(s => s.email === email) || {
            email,
            hum: Array(limits.hum).fill(""),
            tech: Array(limits.tech).fill("")
        };

        // Обновляем только активную вкладку
        const updatedStudent = {
            ...currentStudent,
            [activeTab]: selectedCourses
        };

        setStudentsPreferences(prev => {
            const others = prev.filter(s => s.email !== email);
            return [...others, updatedStudent];
        });

        // Формируем поля только для активной вкладки
        const updateFields = {};
        selectedCourses.forEach((course, i) => {
            updateFields[`${activeTab}${i + 1}`] = course || "";
        });

        try {
            const { data: existing, error: selectError } = await supabase
                .from('priorities')
                .select('*')
                .eq('email', email)
                .single();

            if (selectError && selectError.code !== 'PGRST116') throw selectError;

            if (existing) {
                const { error: updateError } = await supabase
                    .from('priorities')
                    .update(updateFields)
                    .eq('email', email);
                if (updateError) throw updateError;
                alert("Data was successfully submitted");
            } else {
                const { error: insertError } = await supabase
                    .from('priorities')
                    .insert([{ email, ...updateFields }]);
                if (insertError) throw insertError;
                alert("Data was successfully submitted");
            }
        } catch (error) {
            console.error("Ошибка Supabase:", error);
            alert("Error while submitting");
        }
    };

    return { studentsPreferences, onSubmit, limits };
}