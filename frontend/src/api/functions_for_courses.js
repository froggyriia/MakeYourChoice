import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js';

/**
 * Fetches electives/courses available for the user's program
 * @param {string} email - User email (optional, if filtering by program is needed)
 * @param {boolean} [allCourses=false] - If true, returns all courses without program filtering
 * @returns {Promise<Array>} - Array of courses
 */
export async function fetchCourses(email, allCourses = false) {
  try {
    let query = supabase
      .from('catalogue')
      .select('*');

    if (!allCourses && email) {
      const userProgram = await getUserProgram(email);
      if (!userProgram) {
        console.warn(`Program not found for user ${email}`);
        return [];
      }
      query = query
       .contains("program", [userProgram])
       .eq("archived", false);
    }

    const { data, error } = await query;

    if (error) throw error;

    const filteredData = Array.isArray(data) ? data : [];
    if (!allCourses) {
      return filteredData.filter(course => course.archived === false);
    }

    if (allCourses) {
      return [...(Array.isArray(data) ? data : [])].sort((a, b) =>
        a.archived === b.archived ? 0 : a.archived ? 1 : -1
      );
    }

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

/**
 * Adds a new course to the database
 * @param {Object} courseData - Object with new course data
 * @returns {Promise<Object>} - Returns object with added course data and error info
 * @throws {Error} - If course addition fails
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
 * Gets course information by its title
 * @param {string} courseTitle - Course title to search for
 * @returns {Promise<Object>} - Returns object with course information
 * @throws {Error} - If course not found or request error occurs
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
 * Updates course information in the database
 * @param {Object} courseNewData - Object with new course data
 * @param {number} courseNewData.id - Course ID to update (required field)
 * @param {Object} courseNewData... - Other course fields to update
 * @returns {Promise<Object>} - Returns updated course object
 * @throws {Error} - If update error occurs
 */
export const editCourseInfo = async (courseNewData) => {
    try {
        const { id, ...updateData } = courseNewData;

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
 * Deletes a course from the catalogue table by title
 * @param {string} courseTitle - Course title to delete
 * @returns {Promise<{error: Error|null}>} - Object with error (if occurred)
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

/**
 * Filters courses based on provided criteria
 * @param {Object} [filters={}] - Filter criteria object
 * @param {Array} [filters.types] - Course types to filter by
 * @param {Array} [filters.programs] - Programs to filter by
 * @param {Array} [filters.languages] - Languages to filter by
 * @param {boolean} [filters.isArchived] - Archive status to filter by
 * @returns {Promise<Array>} - Filtered list of courses
 */
export async function filterCourses(filters = {}) {
    let query = supabase
    .from('catalogue')
    .select('*')

  if (filters.types?.length) {
    query = query.eq('type', filters.types)
  }

  if (filters.programs?.length) {
    query = query.overlaps('program', filters.programs)
  }

  if (filters.languages?.length) {
    query = query.eq('language', filters.languages)
  }

  if (typeof filters.isArchived === 'boolean') {
    query = query.eq('archived', filters.isArchived)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error while loading courses:', error)
    return []
  }

  return data
}

/**
* Toggles the status of the course (archived/unarchived)
* @param {number} courseId - course ID, that need to be archived/unarchived
* @param {boolean} currentStatus - current archivation status (true - archived, false - unarchived)
* @returns {Promise<Object>} - returns updated course information
* @throws {Error} - if error occurred
*/
export async function archivedCourses(courseId, currentStatus) {
    try {
        const {data, error} = await supabase
         .from("catalogue")
         .update({archived: !currentStatus})
         .eq("id", courseId);

        if (error) throw error;

        return data;
    } catch (error){
        console.error("Error occurred");

        return null;
    }
}

/**
 * Adds a completed course to user's history
 * @param {string} email - User email
 * @param {string} courseTitle - Completed course title
 * @returns {Promise<Object>} - Returns object with added record and error info
 */
export const addCompletedCourse = async (email, courseTitle) => {
  try {
    const { data, error } = await supabase
      .from('course_history')
      .insert({ email, completed_course: courseTitle })
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding completed course:', error.message);
    throw error;
  }
};

/**
 * Gets user's completed courses history
 * @param {string} email - User email
 * @returns {Promise<Array>} - Array of completed courses
 */
export const getCompletedCourses = async (email) => {
  try {
    const { data, error } = await supabase
      .from('course_history')
      .select('completed_course')
      .eq('email', email);

    if (error) throw error;
    return data.map(item => item.completed_course);
  } catch (error) {
    console.error('Error fetching completed courses:', error.message);
    return [];
  }
};

/**
 * Checks if user has completed a specific course
 * @param {string} email - User email
 * @param {string} courseTitle - Course title to check
 * @returns {Promise<boolean>} - True if course is completed
 */
export const hasCompletedCourse = async (email, courseTitle) => {
  try {
    const { data, error } = await supabase
      .from('course_history')
      .select('*')
      .eq('email', email)
      .eq('completed_course', courseTitle)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking course completion:', error.message);
    return false;
  }
};