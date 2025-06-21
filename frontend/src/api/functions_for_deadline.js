import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Sets a deadline for the program (adds to the database)
 * @param {String} programTitle - String with title of program
 * @param {timestamptz} deadline - specific data type for deadline (from the database)
 * @returns {Promise<Object>} - Returns the updated record from 'groups_electives' table
 * @throws {Error} - If there is an error
 */
export const setDeadline = async (programTitle, deadline) => {
  try {
    const { data, error } = await supabase
    .from('groups_electives')
    .update({ deadlines: deadline })
    .eq('student_group', programTitle)
    .select()
    .single();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating program deadline:', error.message);
    throw error;
  }
}