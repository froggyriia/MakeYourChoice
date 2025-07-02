import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js'

/**
 * Checks if the form is active for the specified student program. The catalogue and form should be displayed ONLY if this is true
 *
 * Queries the 'semesters' table for the active semester (where is_active = true)
 * and verifies if the provided student program exists in the list of allowed programs.
 *
 * @async
 * @function isFormActive
 * @param {string} studentProgram - The student's program to check for form availability
 * @returns {Promise<boolean>} - Returns true if the form is active for this program, false otherwise
 * @throws {Error} - Throws an error if there's a database query failure
 */
export const isFormActive = async (studentProgram) => {
    try {
    const { programs, error } = await supabase
      .from('semesters')
      .select('program')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return programs.program.includes(studentProgram);
  } catch (error) {
    console.error('Error adding program:', error.message);
    throw error;
  }
};

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
    const dataToInsert = { ...programData };

    if (dataToInsert.year !== undefined && dataToInsert.group !== undefined) {
      dataToInsert.student_group = `${dataToInsert.year}_${dataToInsert.group}`;

      delete dataToInsert.year;
      delete dataToInsert.group;
    }

    const { data, error } = await supabase
      .from('groups_electives')
      .insert(dataToInsert)
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