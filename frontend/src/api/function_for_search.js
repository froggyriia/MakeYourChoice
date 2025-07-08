import Fuse from 'fuse.js';
import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Enhanced search function that respects current filters
 * @param {string} query - Search text
 * @param {string} currentProgram - Current program filter
 * @param {string} currentType - Current course type filter
 * @returns {Promise<Array>} - Filtered courses
 */
export async function searchCoursesByTitle(query, currentProgram, currentType) {
  try {
    // Start with base query
    let queryBuilder = supabase
      .from('catalogue')
      .select('*')
      .eq('archived', false);

    // Apply program filter if available
    if (currentProgram && currentProgram !== 'all') {
      queryBuilder = queryBuilder.contains('program', [currentProgram]);
    }

    // Apply type filter if available
    if (currentType && currentType !== 'all') {
      queryBuilder = queryBuilder.eq('type', currentType);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    // Return all filtered courses if no search query
    if (!query || query.trim() === '') return data;

    // Perform fuzzy search on pre-filtered data
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