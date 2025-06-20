//functions_for_courses.js

import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js';

/**
<<<<<<< frontend/src/api/functions_for_courses.js
 * Получает элективы/курсы, доступные для программы пользователя
 * @param {string} email - Email пользователя (опционально, если нужно фильтровать по программе)
 * @param {boolean} [allCourses=false] - Если true, вернет все курсы без фильтрации по программе
 * @returns {Promise<Array>} - Массив курсов
 */
export async function fetchCourses(email, allCourses = false) {
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

/**
 * Добавляет новый курс в базу данных
 * @param {Object} courseData - Объект с данными нового курса
 * @returns {Promise<Object>} - Возвращает объект с данными добавленного курса и информацией об ошибке
 * @throws {Error} - Если произошла ошибка при добавлении курса
 */
export const addCourse = async (courseData) => {
  try {
    const { id, ...dataWithoutId } = courseData;
    const { data, error } = await supabase
      .from('catalogue')
      .insert(dataWithoutId)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};

/**
 * Получает информацию о курсе по его названию
 * @param {string} courseTitle - Название курса для поиска
 * @returns {Promise<Object>} - Возвращает объект с информацией о курсе
 * @throws {Error} - Если курс не найден или произошла ошибка запроса
 */
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

/**
 * Обновляет информацию о курсе в базе данных
 * @param {Object} courseNewData - Объект с новыми данными курса
 * @param {number} courseNewData.id - ID курса для обновления (обязательное поле)
 * @param {Object} courseNewData... - Другие поля курса для обновления
 * @returns {Promise<Object>} - Возвращает обновленный объект курса
 * @throws {Error} - Если произошла ошибка обновления
 */
export const editCourseInfo = async (courseNewData) => {
    try {
        const { id, ...updateData } = courseNewData;

        // Очистка и нормализация данных
        const cleanedData = {
            ...updateData,
            years: Array.from(new Set((updateData.years || []).map(Number))),
            program: Array.from(new Set((updateData.program || []).map(String))),
        };

        const { data, error } = await supabase
            .from('catalogue')
            .update(cleanedData)
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

        // Убираем дубликаты и пустые строки
        const programList = Array.from(
            new Set(data.map(item => item.student_group).filter(Boolean))
        );

        return programList;
    } catch (error) {
        console.error("Couldn't return programs", error.message);
        throw error;
    }
};



/**
 * Удаляет курс из таблицы catalogue по названию
 * @param {string} courseTitle - название курса для удаления
 * @returns {Promise<{error: Error|null}>} - Объект с ошибкой (если возникла)
 */
export const deleteCourse = async (courseTitle) => {
  try {
    const { error } = await supabase
      .from('catalogue')
      .delete()
      .eq('title', courseTitle);

    return { error };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { error };
  }
};