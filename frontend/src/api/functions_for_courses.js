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

// функция принимает словарь полей
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

// функция принимает строку - название курса
// функция возвращает одну запись (информацию о курсе) (словарь)
export const getCourseInfo = async (courseTitle) => {
  try {
    const { data, error } = await supabase
    .from('catalogue')
    .select('*')
    .eq('title', courseTitle)
    .single()
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching course:', error.message);
    throw error;
  }
};

// функция принимает словарь полей курса (id важен!!!!!!!!!!)
export const editCourseInfo = async (courseNewData) => {
  try {
    const { id, ...updateData } = courseNewData;

    const { data, error } = await supabase
    .from('catalogue')
    .update(updateData)
    .eq('id', id)
    .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating course:', error.message);
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
