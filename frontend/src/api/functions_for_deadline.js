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

import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Checks whether the course selection deadline is still active for a student group.
 * Returns true only if the current time is before the deadline, false otherwise
 * (including when the deadline has passed or any errors occur).
 *
 * @param {string} studentGroup - The unique identifier of the student's group
 * @returns {Promise<boolean>}
 *    true - if the deadline hasn't passed yet (course selection is still open)
 *    false - if the deadline has passed or any error occurred (selection closed)
 * @throws {Error} Only if Supabase connection fails completely (unlikely in normal operation)
 */
async function checkCourseDeadline(studentGroup) {
  try {
    const { data, error } = await supabase
      .from('groups_electives')
      .select('deadline')
      .eq('student_group', studentGroup)
      .single();

    if (error || !data?.deadline) {
      console.warn(`Deadline not found for group ${studentGroup} or query error:`, error);
      return false;
    }

    const deadline = new Date(data.deadline);
    const now = new Date();

    if (isNaN(deadline.getTime())) {
      console.error(`Invalid deadline format for group ${studentGroup}:`, data.deadline);
      return false;
    }

    return now < deadline;

  } catch (error) {
    console.error(`Critical error checking deadline for group ${studentGroup}:`, error);
    return false;
  }
}

export { checkCourseDeadline };