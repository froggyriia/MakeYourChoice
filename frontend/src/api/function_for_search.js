import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Searches for courses in the catalogue by title
 * @param {string} searchTerm - The term to search for in course titles
 * @param {number} [limit=10] - Maximum number of results to return
 * @returns {Promise<Array>} - Array of course objects matching the search
 */
export const searchCoursesByTitle = async (searchTerm, limit = 10) => {
  try {
    // Use Supabase's ilike operator for case-insensitive search
    // We search for partial matches in the title
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .ilike('title', `%${searchTerm}%`)
      .eq('archived', false) // Only show non-archived courses
      .limit(limit);

    if (error) {
      console.error('Error searching courses:', error);
      throw error;
    }

    console.log('Found courses:', data.length);
    return data;
  } catch (error) {
    console.error('Failed to search courses:', error.message);
    throw error;
  }
};