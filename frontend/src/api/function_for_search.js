import { supabase } from '../pages/supabaseClient.jsx';
import Fuse from 'fuse.js';

/**
 * Searches courses by title with both DB-level and fuzzy search
 * @param {string} searchTerm - Term to search for
 * @param {Object} [options] - Search options
 * @param {number} [options.limit=10] - Max results to return
 * @param {boolean} [options.fuzzy=false] - Enable fuzzy search
 * @returns {Promise<Array>} - Filtered courses
 */
export const searchCoursesByTitle = async (searchTerm, { limit = 10, fuzzy = false } = {}) => {
  try {
    // Base query
    let query = supabase
      .from('catalogue')
      .select('*')
      .eq('archived', false);

    // Apply DB-level search if term provided
    if (searchTerm && searchTerm.trim() !== '') {
      if (fuzzy) {
        // Get all courses for client-side fuzzy search
        const { data, error } = await query;
        if (error) throw error;

        const fuse = new Fuse(data, {
          keys: ['title'],
          threshold: 0.3,
        });

        return fuse.search(searchTerm)
          .map(item => item.item)
          .slice(0, limit);
      } else {
        // Use DB ilike for exact matching
        query = query.ilike('title', `%${searchTerm}%`);
      }
    }

    // Apply limit and execute
    const { data, error } = await query.limit(limit);
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error; // Or return [] depending on your error handling policy
  }
};