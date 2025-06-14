//functions_for_courses.js

import { supabase } from '../pages/supabaseClient.jsx';

export const fetchCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error('Unexpected error fetching courses:', error);
    return [];
  }
};

export const addCourse = async (courseData) => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .insert(courseData)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};
