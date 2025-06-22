/**
 * useFormSubmit.js
 *
 * This custom React hook manages form submission for student course preferences.
 * It handles loading the user's program-specific limits (tech/hum),
 * validating the selection, updating local state, and writing to Supabase.
 */

import { useEffect, useState } from 'react';
import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram, getPrioritiesNumber } from '../api/functions_for_users';

/**
 * Hook to manage course preference form submission and retrieve submission limits.
 *
 * @param {string} email - Current user's email address.
 * @returns {{
 *   studentsPreferences: object[],
 *   onSubmit: (selectedCourses: string[], activeTab: 'tech' | 'hum') => Promise<void>,
 *   limits: { tech: number, hum: number }
 * }}
 */
export function useFormSubmit(email) {
    // State to store local submissions per student
    const [studentsPreferences, setStudentsPreferences] = useState([]);
    // Priority limits per student group, initially defaulting to 5 each
    const [limits, setLimits] = useState({tech : 5, hum : 5});
    // Fetch student's program and corresponding priority limits when email changes
    useEffect(() => {
        // Get the user's program using their email
        async function fetchLimits() {
            const program = await getUserProgram(email)

            if (!program) return;
            // Fetch the allowed number of tech/hum priorities for this program
            const limits = await getPrioritiesNumber(program);
            setLimits(limits);
        }

        if (email) {
            fetchLimits();
        }
    }, [email]);

    /**
     * Handles submission of course preferences for a student.
     *
     * @async
     * @param {string[]} selectedCourses - List of selected course names by priority.
     * @param {'tech' | 'hum'} activeTab - Current preference type being submitted.
     * @returns {Promise<void>}
     * @throws Alerts and logs errors from Supabase or invalid form states.
     */
    const onSubmit = async (selectedCourses, activeTab) => {
        const expectedCount = limits[activeTab];
        // Validate: ensure all priority fields are filled
        if (selectedCourses.length != expectedCount || selectedCourses.some(c => !c)) {
            alert('Please, fill all priority fields');
            return;
        }
        // Get existing local preference or initialize a new one
        const currentStudent = studentsPreferences.find(s => s.email === email) || {
            email,
            hum: Array(limits.hum).fill(""),
            tech: Array(limits.tech).fill("")
        };
        // Update the relevant tab with new selections
        const updatedStudent = {
            ...currentStudent,
            [activeTab]: selectedCourses
        };
        // Replace or add the updated student preferences locally
        setStudentsPreferences(prev => {
            const others = prev.filter(s => s.email !== email);
            return [...others, updatedStudent];
        });
        // Build the Supabase update payload (e.g., tech1, tech2, ...)
        const updateFields = {};
        selectedCourses.forEach((course, i) => {
            updateFields[`${activeTab}${i + 1}`] = course || "";
        });

        try {
            // Check if a row already exists for this email
            const { data: existing, error: selectError } = await supabase
                .from('priorities')
                .select('*')
                .eq('email', email)
                .single();
            // Ignore "no record found" error; rethrow others
            if (selectError && selectError.code !== 'PGRST116') throw selectError;
            // If record exists, update it
            if (existing) {
                const { error: updateError } = await supabase
                    .from('priorities')
                    .update(updateFields)
                    .eq('email', email);
                if (updateError) throw updateError;
                alert("Data was successfully submitted");
            } else {
                // If no record, insert a new one
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