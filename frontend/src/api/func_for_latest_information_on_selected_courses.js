/**
 * Retrieves the most recent priorities record for a given user from the 'priorities' table
 *
 * @param {string} userEmail - The email of the user whose priorities should be fetched
 * @param {object} supabaseClient - The initialized Supabase client instance
 * @returns {Promise<object|null>} The most recent priorities record or null if not found/error
 * @throws {Error} If supabaseClient is not provided or invalid
 *
 * @example
 * const priorities = await getLatestUserPriorities('student@example.com', supabase);
 */
async function getLatestUserPriorities(userEmail, supabaseClient) {
  if (!userEmail || typeof userEmail !== 'string') {
    console.error('Invalid userEmail parameter');
    return null;
  }

  if (!supabaseClient || typeof supabaseClient.from !== 'function') {
    throw new Error('Valid Supabase client is required');
  }

  try {
    const { data, error } = await supabaseClient
      .from('priorities')
      .select('*')
      .eq('email', userEmail)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error.message);
      return null;
    }

    return data?.[0] || null;

  } catch (err) {
    console.error('Unexpected error in getLatestUserPriorities:', err.message);
    return null;
  }
}

export default getLatestUserPriorities;