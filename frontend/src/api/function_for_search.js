import Fuse from 'fuse.js';
import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Search courses from the 'catalogue' table by title.
 * @param {string} query - The search text entered by the student.
 * @returns {Promise<Array>} - Filtered list of matching courses.
 */
export async function searchCoursesByTitle(query) {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .eq('archived', false);

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    if (!query || query.trim() === '') return data;

    const fuse = new Fuse(data, {
      keys: ['title', 'description', 'teacher'],
      threshold: 0.3,
      includeMatches: true,
    });

    const result = fuse.search(query);

    return result.map(({ item, matches }) => ({
      ...item,
      _matches: matches,
    }));
  } catch (err) {
    console.error('Unexpected error during course search:', err);
    return [];
  }
}
