import { supabase } from '../pages/supabaseClient.jsx';

export const saveSemesterInfo = async (semData) => {
  try {
    const { id, ...dataWithoutId } = semData;
    const { data, error } = await supabase
      .from('semesters')
      .insert(dataWithoutId)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};