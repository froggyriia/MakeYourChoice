import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram, getUserYear } from './functions_for_users.js';

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
export const getCourseInfo = async (courseId) => {
  try {
    const { data, error } = await supabase
    .from('catalogue')
    .select('*')
    .eq('id', courseId)
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
            years: Array.from(new Set((updateData.years || []).map(String))),
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
export const deleteCourse = async (courseId) => {
  try {
    const { error } = await supabase
      .from('catalogue')
      .delete()
      .eq('id', courseId);

    return { error };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { error };
  }
};


/**
 * Fetches and filters courses based on students' academic group
 * @param {Object} options - Configuration options
 * @param {string} [options.email] - User email for program filtering
 * @param {boolean} [options.allCourses=false] - If true, returns all courses without program filtering
 * @returns {Promise<Array>} - Filtered array of courses
 */
export async function fetchCourses(email, allCourses = false) {
  try {
    let query = supabase
      .from('catalogue')
      .select('*');

    if (!allCourses && email) {
      const userProgram = await getUserProgram(email);
      const userYear = await getUserYear(email);

      if (!userProgram || !userYear) {
        console.warn('User data not found for', email);
        return [];
      }

      query = query
        .contains('program', [userProgram])
        .contains('years', [userYear])
        .eq('archived', false);
    }

    const { data, error } = await query;
    if (error) throw error;

    let resultData = Array.isArray(data) ? data : [];

    if (!allCourses && email) {
      const { data: historyData, error: historyError } = await supabase
        .from('history')
        .select('course')
        .eq('email', email);

      if (!historyError && historyData) {
        const completedCourses = historyData
          .filter(item => item.course !== null)
          .map(item => item.course);

        resultData = resultData.filter(course =>
          !completedCourses.includes(course.title)
        );
      }
    }

    if (allCourses) {
      resultData.sort((a, b) =>
        a.archived === b.archived ? 0 : a.archived ? 1 : -1
      );
    }

    return resultData;

  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
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
};

export async function archiveCourse(courseId) {
    try {
        const { data, error } = await supabase
            .from("catalogue")
            .update({ archived: true })
            .eq("id", courseId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error archiving course:", error.message);
        return null;
    }
}

export async function unarchiveCourse(courseId) {
    try {
        const { data, error } = await supabase
            .from("catalogue")
            .update({ archived: false })
            .eq("id", courseId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error unarchiving course:", error.message);
        return null;
    }
};
