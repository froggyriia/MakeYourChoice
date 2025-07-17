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

    return data.student_group;
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
/**
 * Checks if a priority record exists for the given email.
 *
 * @async
 * @param {string} email - User's email address
 * @returns {Promise<object|null>} Existing record or null if not found
 */
export async function checkExistingPriority(email) {
    try {
        const { data, error } = await supabase
            .from('priorities')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    } catch (error) {
        console.error('Error checking existing priority:', error);
        throw error;
    }
}

/**
 * Updates existing priority record in the database.
 *
 * @async
 * @param {string} email - User's email address
 * @param {object} updateFields - Fields to update (e.g., {tech1: "Course1", tech2: "Course2"})
 * @returns {Promise<void>}
 */
export async function updatePriority(email, updateFields) {
    try {
        const { error } = await supabase
            .from('priorities')
            .update(updateFields)
            .eq('email', email);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating priority:', error);
        throw error;
    }
}

/**
 * Creates a new priority record in the database.
 *
 * @async
 * @param {string} email - User's email address
 * @param {object} fields - All fields to insert (e.g., {email: "user@example.com", tech1: "Course1"})
 * @returns {Promise<void>}
 */
export async function createPriority(email, fields) {
    try {
        const { error } = await supabase
            .from('priorities')
            .insert([{ email, ...fields }]);

        if (error) throw error;
    } catch (error) {
        console.error('Error creating priority:', error);
        throw error;
    }
}

/**
 * Submit priorities to both all_priorities (with history) and last_priorities (only latest)
 * @param {string} email
 * @param {object} updateFields - e.g. {tech1: "Course1", hum2: "Course2"}
 */
export async function submitPriority(email, updateFields) {
  try {
    const fullData = {
      email: String(email),
      created_at: new Date().toISOString(), // Используем существующий столбец
      ...updateFields
    };

    console.log('Подготовленные данные:', fullData);

    // 1. Запись в all_priorities
    await supabase.from('all_priorities').insert([fullData]);

    // 2. UPSERT в last_priorities
    const { error } = await supabase
      .from('last_priorities')
      .upsert([fullData], {
        onConflict: 'email'
      });

    if (error) throw error;
    return { success: true };

  } catch (error) {
    console.error('Ошибка UPSERT:', {
      message: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }
}

/**
 * Get last priorities for a user
 * @param {string} email
 */
export async function getLastPriorities(email) {
  const { data, error } = await supabase
    .from('last_priorities')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

/**
 * Get all priority submissions history for a user
 * @param {string} email
 */
export async function getPriorityHistory(email) {
  const { data, error } = await supabase
    .from('all_priorities')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}