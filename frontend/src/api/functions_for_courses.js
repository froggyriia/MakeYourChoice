import { supabase } from '../pages/supabaseClient.jsx';

export const fetchCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    throw error;
  }
};

export const addCourse = async (courseData) => {
  try {
    const { data, error } = await supabase
      .from('catalogue')
      .insert(courseData)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};
