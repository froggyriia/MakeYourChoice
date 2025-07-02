import { supabase } from '../pages/supabaseClient.jsx';
/**
 * Saves semester information to the database.
 * If a semester with the given name and year exists, updates it; otherwise creates a new record.
 * @param {Object} semData - Semester data object
 * @param {string} semData.semester - Semester name (e.g., "Fall")
 * @param {number} semData.semester_year - Academic year
 * @param {string} [semData.start_date] - Start date (optional)
 * @param {string} [semData.end_date] - End date (optional)
 * @param {Array} [semData.courses] - List of courses (optional)
 * @param {number} [semData.id] - Semester ID (automatically removed before saving)
 * @returns {Promise<Array>} Array of saved semester records
 * @throws {Error} If database operation fails
 */
export const saveSemesterInfo = async (semData) => {
  try {

    const { id, ...dataWithoutId } = semData;

    let result;

    if (await isSemesterExists(dataWithoutId.semester, dataWithoutId.semester_year)) {
      result = await supabase
        .from('semesters')
        .update(dataWithoutId)
        .eq('semester', dataWithoutId.semester)
        .eq('semester_year', dataWithoutId.semester_year)
        .select();
    } else {
      result = await supabase
        .from('semesters')
        .insert(dataWithoutId)
        .select();
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Error saving semester info:', error.message);
    throw error;
  }
};
/**
 * Retrieves semester information from the database.
 * @param {Object} semData - Semester identifier object
 * @param {string} semData.semester - Semester name
 * @param {number} semData.semester_year - Academic year
 * @returns {Promise<Array|null>} Array of semester records if found, null otherwise
 * @throws {Error} If database operation fails
 */
export const getSemesterInfo = async (semData) => {
  try {
    let result;

    if (await isSemesterExists(semData.semester, semData.semester_year)) {
       result = await supabase
      .from('semesters')
      .select('*')
      .eq('semester', semData.semester)
      .eq('semester_year', semData.semester_year);
    }
    else {
        return null;
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};
/**
 * Checks if a semester exists in the database.
 * @param {string} semTitle - Semester name
 * @param {number} semYear - Academic year
 * @returns {Promise<boolean>} True if semester exists, false otherwise
 * @throws {Error} If database operation fails
 */
export const isSemesterExists = async (semTitle, semYear) => {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('courses')
      .eq('semester', semTitle)
      .eq('semester_year', semYear)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if semester exists:', error.message);
    throw error;
  }
};