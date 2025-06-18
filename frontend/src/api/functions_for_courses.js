//functions_for_courses.js

import { supabase } from '../pages/supabaseClient.jsx';

export const fetchCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('Unexpected error fetching courses:', error);
    return [];
  }
};

export const addCourse = async (courseData) => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .insert(courseData)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};

/**
 * Retrieves a list of all unique academic program names from the database.
 *
 * @async
 * @returns {Promise<string[]>} An array of academic program names.
 * @throws Will log and rethrow any Supabase fetch error.
 */
 export const uniquePrograms = async () => {
    try {
    const { data, error } = await supabase
        .from('groups_electives')
        .select('student_group');

        if (error) throw error;

        const programList = data.map(item => item.group)
        return programList;
    } catch (error) {
        console.error("Couldn't return programs", error.message);
        throw error;
    }
}