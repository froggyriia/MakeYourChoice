import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Fetches the academic program name (e.g., "B24-DSAI") for a given user email.
 *
 * @async
 * @param {string} email - The email address of the student.
 * @returns {Promise<string|null>} The academic program name if found and correctly formatted, otherwise null.
 */
 export async function getUserProgram(email) {
  try {
    const { data, error } = await supabase
      .from('emails_groups')
      .select('student_group')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    const group = data.student_group;
    return group;
  } catch (err) {
    console.error('Error in getUserProgram:', err);
    return null;
  }
}


/**
 * Shows the number of technical and humanitarian elective priorities for a given academic program.
 *
 * @async
 * @param {string} programName - The name of the academic program (e.g., "B24-DSAI").
 * @returns {Promise<{ tech: number, hum: number }>} An object with the number of tech and hum electives. Defaults to 0 if not found or error.
 */
 export async function getPrioritiesNumber(programName) {
    try {
        const { data, error } = await supabase
            .from('groups_electives')
            .select('tech, hum') // need only number for tech and hum electives
            .eq('student_group', programName)
            .single();

        if (error || !data) {
            console.error('Error fetching number of priorities:', error);
            return {tech : 0, hum : 0};
        }

        return {
            tech: data.tech || 0,
            hum: data.hum || 0
        };
    } catch (err) {
        console.error('Unexpected error in getElectiveLimits:', err);
        return { tech: 0, hum: 0 };
  }
}

export async function getUserYear(email) {
  try {
    const { data, error } = await supabase
      .from('emails_groups')
      .select('year')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    return data.year;
  } catch (err) {
    console.error('Error in getUserProgram:', err);
    return null;
  }
}