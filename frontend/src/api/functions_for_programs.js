import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js'

/**
 * Gets program info based on its title
 * @param {string} programTitle - program title
 * @returns {Promise<Object>} - an object with info about the program (all the columns from the db)
 * @throws {Error} - If an error occurs
 */
export const getProgramInfo = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }

  try {
    const programTitle = await getUserProgram(email);

    if (!programTitle) {
      console.warn(`No program found for email: ${email}`);
      return null;
    }

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

/**
 * Add a new program to the db
 * @param {Object} programData - an object of program type (with specific columns)
 * @returns {Promise<Object>} - an object of program type
 * @throws {Error} - If an error occurs
 */
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


/**
 * Edits columns of program type object in db
 * @param {Object} programNewData - updated data about the program
 * @returns {Promise<Object>} - an updated object
 * @throws {Error} - if an error occurs
 */
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

/**
 * Deletes a program based on its title
 * @param {string} programTitle - title of the program
 * @returns {Promise<Object>} - an object of program data type
 * @throws {Error} - if an error occurs
 */
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

/**
 * Simply gets the deadline for the program from the db
 * @param {string} programTitle - program title
 * @returns {timestamptz} - deadline of the program
 * @throws {Error} - If an error occurs
 */
export async function getDeadlineForGroup(programTitle) {
  try {
    const { data, error } = await supabase
        .from('groups_electives')
        .select('deadline')
        .eq('student_group', programTitle)
        .single();

    if (error || !data) {
      console.error('Error fetching deadline:', error);
      return null;
    }

    return data.deadline;
  } catch (err) {
    console.error('Unexpected error in getDeadlineForGroup:', err);
    return null;
  }
}