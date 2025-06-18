//functions_for_courses.js

import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js';

/**
 * Получает элективы/курсы, доступные для программы пользователя
 * @param {string} email - Email пользователя (опционально, если нужно фильтровать по программе)
 * @param {boolean} [allCourses=false] - Если true, вернет все курсы без фильтрации по программе
 * @returns {Promise<Array>} - Массив курсов
 */
export async function fetchCourses(email = null, allCourses = false) {
  try {
    let query = supabase
      .from('catalogue')
      .select('*')
      .order('created_at', { ascending: false });


    if (!allCourses && email) {
      const userProgram = await getUserProgram(email);
      if (!userProgram) {
        console.warn(`Программа не найдена для пользователя ${email}`);
        return [];
      }
      query = query.contains('program', [userProgram]);
    }

    const { data, error } = await query;

    if (error) throw error;

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    return [];
  }
}

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