import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Checks if the course selection deadline has passed for a student group
 *
 * @param {string} studentGroup - The student's group identifier
 * @returns {Promise<{isDeadlinePassed: boolean, currentDeadline: string|null, timeRemaining: object|null, error: string|null}>}
 *    Object containing deadline status, remaining time (if applicable), and error information
 * @throws {Error} If Supabase query fails unexpectedly
 */
async function checkCourseDeadline(studentGroup) {
  try {
    const now = new Date();

    const { data, error } = await supabase
      .from('groups_electives')
      .select('deadline')
      .eq('student_group', studentGroup)
      .single();

    if (error) throw error;
    if (!data || !data.deadline) {
      console.warn(`No deadline found for group: ${studentGroup}`);
      return {
        isDeadlinePassed: true,
        currentDeadline: null,
        timeRemaining: null,
        error: 'Deadline not found'
      };
    }

    const deadline = new Date(data.deadline);
    const timeRemaining = calculateTimeRemaining(data.deadline);

    return {
      isDeadlinePassed: now >= deadline,
      currentDeadline: data.deadline,
      timeRemaining: timeRemaining.total > 0 ? timeRemaining : null,
      error: null
    };
  } catch (error) {
    console.error(`Deadline check failed for group ${studentGroup}:`, error);
    return {
      isDeadlinePassed: true,
      currentDeadline: null,
      timeRemaining: null,
      error: error.message
    };
  }
}

/**
 * Calculates time remaining until deadline
 *
 * @param {string} deadlineString - ISO format deadline date string
 * @returns {object} Object containing remaining time breakdown:
 *    {total: number, days: number, hours: number, minutes: number, seconds: number}
 */
function calculateTimeRemaining(deadlineString) {
  const deadline = new Date(deadlineString);
  const total = Date.parse(deadline) - Date.parse(new Date());

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

/**
 * Formats time remaining into human-readable string
 *
 * @param {object} timeRemaining - Time remaining object from calculateTimeRemaining()
 * @returns {string} Formatted time string (e.g., "2 days 3 hours 15 minutes")
 */
function formatTimeRemaining(timeRemaining) {
  if (!timeRemaining || timeRemaining.total <= 0) {
    return 'Deadline passed';
  }

  const { days, hours, minutes, seconds } = timeRemaining;

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Sets up automatic deadline checking at regular intervals
 *
 * @param {string} studentGroup - The student's group identifier
 * @param {function} callback - Function to call with deadline status updates
 * @param {number} [interval=60000] - Check interval in milliseconds (default: 1 minute)
 * @returns {function} Cleanup function to stop the interval checks
 */
function setupDeadlineWatcher(studentGroup, callback, interval = 60000) {
  // Initial immediate check
  checkCourseDeadline(studentGroup).then(callback);

  // Set up periodic checking
  const intervalId = setInterval(async () => {
    const result = await checkCourseDeadline(studentGroup);
    callback(result);
  }, interval);

  // Return cleanup function
  return () => {
    console.log(`Stopping deadline watcher for group: ${studentGroup}`);
    clearInterval(intervalId);
  };
}

export {
  supabase,
  checkCourseDeadline,
  calculateTimeRemaining,
  formatTimeRemaining,
  setupDeadlineWatcher
};
