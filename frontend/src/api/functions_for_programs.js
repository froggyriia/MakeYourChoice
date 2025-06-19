import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js'

/**
 * Получает информацию о программе по ее названию
 * @param {string} programTitle - Название программы для поиска
 * @returns {Promise<Object>} - Возвращает объект с информацией о программе
 * @throws {Error} - Если программа не найдена или произошла ошибка запроса
 */
export const getProgramInfo = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    // 1. Получаем программу пользователя по email
    const programTitle = await getUserProgram(email);

    if (!programTitle) {
      console.warn(`No program found for email: ${email}`);
      return null;
    }

    // 2. Получаем информацию об элективах по программе
    const { data, error } = await supabase
      .from('groups_electives')
      .select('*')
      .eq('student_group', programTitle)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      console.warn(`No electives found for program: ${programTitle}`);
      return null;
    }

    return data;

  } catch (error) {
    console.error('Error in getProgramInfo:', error.message);
    throw error;
  }
};
export const addProgram = async (programData) => {
  try {
    const { data, error } = await supabase
      .from('groups_electives')
      .insert(programData)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding program:', error.message);
    throw error;
  }
};

export const editProgramInfo = async (programNewData) => {
  try {
    const { id, ...updateData } = programNewData;

    const { data, error } = await supabase
    .from('groups_electives')
    .update(updateData)
    .eq('id', id)
    .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating program:', error.message);
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

export const deleteProgram = async (programTitle) => {
  try {
    const { error } = await supabase
      .from('groups_electives')
      .delete()
      .eq('student_group', programTitle);

    return { error };
  } catch (error) {
    console.error('Error deleting program:', error);
    return { error };
  }
};

export async function getDeadlineForGroup(programName) {
  try {
    const { data, error } = await supabase
        .from('groups_electives')
        .select('deadline')
        .eq('student_group', programName)
        .single();

    if (error || !data) {
      console.error('Error fetching deadline:', error);
      return null;
    }

    return data.deadline; // вернётся строка в формате timestamptz
  } catch (err) {
    console.error('Unexpected error in getDeadlineForGroup:', err);
    return null;
  }
}