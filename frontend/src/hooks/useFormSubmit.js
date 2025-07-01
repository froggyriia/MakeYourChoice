/**
 * useFormSubmit.js
 *
 * This custom React hook manages form submission for student course preferences.
 * It handles loading the user's program-specific limits (tech/hum),
 * validating the selection, updating local state, and writing to Supabase.
 */

import { useEffect, useState } from 'react';
import { getUserProgram, getPrioritiesNumber } from '../api/functions_for_users';
import {
    submitPriority
} from '../api/functions_for_users';

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

      // Validation remains the same
      if (selectedCourses.length != expectedCount || selectedCourses.some(c => !c)) {
        alert('Please fill all priority fields');
        return;
      }

      // Prepare update fields
      const updateFields = {};
      selectedCourses.forEach((course, i) => {
        updateFields[`${activeTab}${i + 1}`] = course || "";
      });

      try {
        // This will now handle both tables automatically
        await submitPriority(email, updateFields);

        // Update local state
        setStudentsPreferences(prev => {
          const current = prev.find(s => s.email === email) || {
            email,
            tech: Array(limits.tech).fill(""),
            hum: Array(limits.hum).fill("")
          };
          return [
            ...prev.filter(s => s.email !== email),
            { ...current, [activeTab]: selectedCourses }
          ];
        });

        alert("Priorities submitted successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit priorities");
      }
    };

    return { studentsPreferences, onSubmit, limits };
}