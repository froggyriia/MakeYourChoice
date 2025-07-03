// Import Fuse.js for fuzzy search
import Fuse from 'fuse.js';
// Import Supabase client
import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Search courses from the 'catalogue' table by title.
 * @param {string} query - The search text entered by the student.
 * @returns {Promise<Array>} - Filtered list of matching courses.
 */
export async function searchCoursesByTitle(query) {
  try {
    // Fetch all non-archived courses from Supabase
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .eq('archived', false);

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    // If query is empty, return all courses
    if (!query || query.trim() === '') {
      return data;
    }

    // Fuse.js options for fuzzy searching
    const fuse = new Fuse(data, {
      keys: ['title'],
      threshold: 0.3, // lower is stricter
    });

    // Perform search
    const result = fuse.search(query);

    // Extract items from Fuse.js result
    const filteredCourses = result.map(item => item.item);

    return filteredCourses;
  } catch (err) {
    console.error('Unexpected error during course search:', err);
    return [];
  }
}
