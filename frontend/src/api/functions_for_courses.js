import { supabase } from '../pages/supabaseClient.jsx';
import { getUserProgram } from './functions_for_users.js';

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
 * Fetches and filters courses based on various criteria
 * @param {Object} options - Configuration options
 * @param {string} [options.email] - User email for program filtering
 * @param {boolean} [options.allCourses=false] - If true, returns all courses without program filtering
 * @param {Object} [options.filters={}] - Filter criteria (types, programs, languages, isArchived)
 * @returns {Promise<Array>} - Filtered array of courses
 */
export async function fetchCourses(email, allCourses = false, filters = {}) {
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

    const initialData = Array.isArray(data) ? data : [];

    let completedCourses = [];
    console.log("email", email);
    if (!allCourses && email) {
      let historyQuery = supabase
        .from('history')
        .select('course')
        .eq('email', email);

    console.log("Supabase response data:", historyQuery);
console.log("Supabase error:", historyQuery);

      const { data: historyData, error: historyError } = await historyQuery;

      if (historyError) {
        console.error("Error fetching course history:", historyError);
      } else {
        completedCourses = historyData
          .filter(item => item.course !== null)
          .map(item => item.course);
      }
    }

    let filteredData = initialData.filter(course => {
      const typeMatch = !filters.types?.length || filters.types.includes(course.type);
      const programMatch = !filters.programs?.length ||
                         (course.program || []).some(prog => filters.programs.includes(prog));
      const languageMatch = !filters.languages?.length ||
                         filters.languages.includes(course.language);
      const archiveMatch = typeof filters.isArchived !== 'boolean' ||
                         course.archived === filters.isArchived;

      const notCompleted = allCourses || !completedCourses.includes(course.title);

      return typeMatch && programMatch && languageMatch && archiveMatch && notCompleted;
    });

    if (!allCourses) {
      filteredData = filteredData.filter(course => course.archived === false);
    }

    if (allCourses) {
      filteredData.sort((a, b) =>
        a.archived === b.archived ? 0 : a.archived ? 1 : -1
      );
    }

    return filteredData;

  } catch (error) {
    console.error('Error fetching and filtering courses:', error);
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
;}

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
